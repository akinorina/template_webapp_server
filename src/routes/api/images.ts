/**
 * Restful API - Image
 *
 * http method   URI                   Controller#Action        http status code
 * -------------+---------------------+------------------------+------------------
 *      GET      /api/images           images#index (get list)  200 (OK)
 *      POST     /api/images           images#create            200 (OK) / 201 (Created)
 *      GET      /api/images/:id       images#show              200 (OK)
 *      PUT      /api/images/:id       images#update            200 (OK) / 204 (No Content)
 *      PATCH    /api/images/:id       images#update            200 (OK) / 204 (No Content)
 *      DELETE   /api/images/:id       images#delete            204 (NO Content)
 *
 * parameters:
 *  start: 取得開始位置 (0はじまり)
 *  limit: 取得最大数 (default: 10)
 *  q    : 文字列検索 (部分一致)
 *
 */

// Express
import express from 'express'
// path
import path from 'path'
// fs
import fs from 'fs'

// libs
import { getAllParameters } from '../../lib/libServer'
import { isAuthenticatedForApi } from '../../lib/libAuth'

// DB access by TypeORM
import { Like } from "typeorm";
import dataSource from '../../dataSource'
import { Image } from '../../entity/Image';

// console logger
// import consoleLogger from '../../lib/log/consoleLogger'

// サーバー設定
import serverConfig from '../../config/server_config'

// dir: APP_ROOT
const APP_ROOT = path.join(__dirname, '../../../')

// express router
const imagesRouter = express.Router()

// ------------------------------------------------------------------------------------------
// #index
// ------------------------------------------------------------------------------------------
imagesRouter.get('/', isAuthenticatedForApi, async function (req, res, next) {
  // consoleLogger.info('--- run /api/images #index --- start. ---')

  // (1). パラメータ取得
  const parameters = getAllParameters(req);
  // consoleLogger.debug('parameters', parameters);

  // (2). DBアクセス
  const options: any = { skip: 0, take: 10, where: [ { userId: req.user.id } ] };
  if (parameters.start !== undefined && typeof parseInt(parameters.start) === 'number') {
    options.skip = parseInt(parameters.start);
  }
  if (parameters.limit !== undefined && typeof parseInt(parameters.limit) === 'number') {
    options.take = parseInt(parameters.limit);
  }
  if (typeof parameters.q === 'string') {
    options.where.push({ name: Like('%' + parameters.q + '%') });
  }
  // consoleLogger.debug('--- options: ', options);
  const result = await dataSource.getRepository(Image).findAndCount(options);
  // consoleLogger.debug('--- ', result);

  // (3). レスポンスデータ作成、レスポンス
  const resData = {
    status: 'success',
    total: result[1],
    data: result[0]
  };
  res.json(resData);

  // consoleLogger.info('--- run /api/images #index --- end. ---')
})

// ------------------------------------------------------------------------------------------
// #create
// ------------------------------------------------------------------------------------------
imagesRouter.post('/', isAuthenticatedForApi, async function (req: express.Request, res: express.Response, next: express.NextFunction) {
  // consoleLogger.info('--- run /api/images/ #create --- start. ---')

  // (1). ログインユーザーCHECK
  if (!req.user) {
    throw new Error('not login.');
  }

  // (2). パラメータ取得
  const parameters = getAllParameters(req);
  // consoleLogger.debug('parameters', parameters);
  if (!parameters.file_content) {
    // redirect to management-top.
    res.redirect('/management/image');
    return;
  }
  // consoleLogger.debug('parameters', parameters);

  // ---
  // ファイル保存、DB登録
  // ---
  // ファイル画像データ
  const targetImageData = String(parameters.file_content);
  // 画像UPLOADエラー
  let errorMessages: Array<any> = [];

  // ファイルデータサイズ > 0 
  if (targetImageData == '') {
    errorMessages.push({ filename: parameters.file_name, message: 'image size is zero. : ' })
  }

  // アップロードファイルサイズ確認
  if (targetImageData.length > serverConfig.app.image_management.maxSize) {
    errorMessages.push({ filename: parameters.file_name, message: 'image size is too big! : ' + targetImageData.length })
  }

  // mimetype 対応確認
  if (!serverConfig.app.image_management.mimeType.includes(parameters.file_mimetype)) {
    errorMessages.push({ filename: parameters.file_name, message: 'image mime_type is invalid: ' + parameters.file_mimetype })
  }

  if (errorMessages.length == 0) {
    // ---
    // ファイルを保存・配置
    // ---
    // 保存するファイル名は同じファイル名が生じるケースを考えてDate.now()をつけたす
    let uploadFileExt = path.extname(parameters.file_name);
    let saveFilename = `${path.basename(parameters.file_name, uploadFileExt)}-${Date.now()}${uploadFileExt}`;

    // サーバー上の保存位置
    let savedDir = `${serverConfig.app.image_management.savedImageDir}/${req.user.id}/`;
    if (!fs.existsSync(path.join(APP_ROOT, 'public', savedDir))) {
      // 保存先ディレクトリが無い場合は作成
      fs.mkdirSync(path.join(APP_ROOT, 'public', savedDir), { recursive: true, mode: 0o777 });
    }
    let filePath = `public/${savedDir}${saveFilename}`;
    // URLパス
    let urlPath = `/${savedDir}${saveFilename}`;

    // ファイル保存
    const decode = Buffer.from(targetImageData, "base64");
    // ファイル出力
    fs.writeFileSync(filePath, decode);

    // ---
    // DB登録
    // ---

    // 生成データ作成
    const image = {
      userId: req.user ? req.user.id : 0,
      fileName: parameters.file_name,
      fileMimetype: parameters.file_mimetype,
      filePath: filePath,
      fileUrl: urlPath
    };
    // consoleLogger.debug('image: ', image)

    // 生成実行
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(Image)
      .values(image)
      .execute();

    // (4). レスポンスデータ作成、レスポンス
    const resData = { status: 'success', data: image };
    res.json(resData);
  } else {
    // (4). 画像保存不可のケースのレスポンスデータ作成、レスポンス
    const resData = { status: 'failure', data: null };
    res.json(resData);
  }

  // consoleLogger.info('--- run /api/images/ #create --- end. ---')
})

// ------------------------------------------------------------------------------------------
// #show
//   ID が該当するデータがない場合 data: null を返す
// ------------------------------------------------------------------------------------------
imagesRouter.get('/:id', isAuthenticatedForApi, async function (req, res, next) {
  // consoleLogger.info('--- run /api/images/:id #show --- start. ---')

  // (1). パラメータ取得
  const parameters = getAllParameters(req);
  // consoleLogger.debug('parameters', parameters);

  // (2). DBアクセス、対応する個人データ取得
  const options: any = { id: parameters.id, userId: req.user.id };
  const image = await dataSource.getRepository(Image).findOneBy(options)
  // consoleLogger.debug('--- image: ', image);

  // (3). レスポンスデータ作成、レスポンス
  const resData: any = { status: 'success', data: null };
  if (image != null) {
    resData.data = image
  }
  res.json(resData);

  // consoleLogger.info('--- run /api/images/:id #show --- end. ---')
})

// ------------------------------------------------------------------------------------------
// #update
// ------------------------------------------------------------------------------------------
imagesRouter.put('/:id', isAuthenticatedForApi, async function (req, res, next) {
  // consoleLogger.info('--- run /api/images/:id #update --- start. ---')

  // (1). ログインユーザーCHECK
  if (!req.user) {
    throw new Error('not login.');
  }

  // (2). パラメータ取得
  const parameters = getAllParameters(req);
  if (!parameters.file_content) {
    // redirect to management-top.
    res.redirect('/management/image');
    return;
  }
  // consoleLogger.debug('parameters', parameters);

  // ---
  // IDによる対象データ取得
  // ---
  const image = await dataSource.getRepository(Image).findOneBy({ id: parameters.id })
  if (image == null) {
    throw new Error('could not find the image id: ' + parameters.id)
  }
  // consoleLogger.debug('image: ', image)

  // 画像の所有者ユーザーID確認
  const user_id = req.user ? req.user.id : 0;
  if (user_id != image.userId) {
    // ユーザーが異なる場合はエラー
    const errorMessage = 'image data were modified by the invalid user.';
    // consoleLogger.error(errorMessage)
    res.json({ status: 'failure', data: null, message: errorMessage });
    return false;
  }
  // 画像ID
  let image_id = image.id;
  // 画像 mime type
  let fileName = image.fileName;
  // 画像 mime type
  let fileMimetype = image.fileMimetype;
  // サーバー上の保存位置
  let filePath = image.filePath;
  // URLパス
  let urlPath = image.fileUrl;

  // ---
  // ファイル保存、DB登録
  // ---
  // ファイル画像データ
  const targetImageData = String(parameters.file_content);
  // 画像UPLOADエラー
  let errorMessages: Array<any> = [];

  // ファイルデータサイズ > 0
  if (targetImageData == '') {
    errorMessages.push({ filename: parameters.file_name, message: 'image size is zero. : ' })
  }

  // アップロードファイルサイズ確認
  if (targetImageData.length > serverConfig.app.image_management.maxSize) {
    errorMessages.push({ filename: parameters.file_name, message: 'image size is too big! : ' + targetImageData.length })
  }

  // mimetype 対応確認
  if (!serverConfig.app.image_management.mimeType.includes(parameters.file_mimetype)) {
    errorMessages.push({ filename: parameters.file_name, message: 'image mime_type is invalid: ' + parameters.file_mimetype })
  }
  // consoleLogger.debug('errorMessages: ', errorMessages);

  if (errorMessages.length == 0) {
    // ---
    // 既存ファイルの削除
    // ---
    // 画像ファイルの物理削除
    if (fs.existsSync(path.join(APP_ROOT, filePath))) {
      fs.rmSync(path.join(APP_ROOT, filePath));
    }

    // ---
    // ファイルを保存・配置
    // ---
    // 保存するファイル名は同じファイル名が生じるケースを考えてDate.now()をつけたす
    let uploadFileExt = path.extname(parameters.file_name);
    let saveFilename = `${path.basename(parameters.file_name, uploadFileExt)}-${Date.now()}${uploadFileExt}`;

    // サーバー上の保存位置
    let savedDir = `${serverConfig.app.image_management.savedImageDir}/${req.user.id}/`;
    if (!fs.existsSync(path.join(APP_ROOT, 'public', savedDir))) {
      // 保存先ディレクトリが無い場合は作成
      fs.mkdirSync(path.join(APP_ROOT, 'public', savedDir), { recursive: true, mode: 0o777 });
    }
    // file path
    filePath = `public/${savedDir}${saveFilename}`;
    // URL path
    urlPath = `/${savedDir}${saveFilename}`;
    // file name
    fileName = parameters.file_name;
    // mime type
    fileMimetype = parameters.file_mimetype;

    // メモリ上にあるファイルをサーバーパスへ移動させる
    // ファイル保存
    const decode = Buffer.from(parameters.file_content, "base64");
    // ファイル出力
    fs.writeFileSync(filePath, decode);
  }

  // ---
  // DB更新
  // ---

  // 生成データ作成
  let imageData = {
    userId: user_id,
    fileName: fileName,
    fileMimetype: fileMimetype,
    filePath: filePath,
    fileUrl: urlPath
  };
  // consoleLogger.debug('imageData: ', imageData)

  // 生成実行
  const updatedImage = await dataSource
        .createQueryBuilder()
        .update(Image)
        .set(imageData)
        .where("id = :id", { id: image_id })
        .execute();

  // (4). レスポンスデータ作成、レスポンス
  const resData: any = { status: 'failure', data: imageData };
  if (updatedImage.affected !== undefined && updatedImage.affected === 1) {
    resData.status = 'success';
  }
  res.json(resData);

  // consoleLogger.info('--- run /api/images/:id #update --- end. ---')
})

// ------------------------------------------------------------------------------------------
// #update (patch) 処理内容は #update と同様
// ------------------------------------------------------------------------------------------
imagesRouter.patch('/:id', isAuthenticatedForApi, async function (req, res, next) {
  // consoleLogger.info('--- run /api/images/:id #update (patch) --- start. ---')

  // (1). ログインユーザーCHECK
  if (!req.user) {
    throw new Error('not login.');
  }

  // (2). パラメータ取得
  const parameters = getAllParameters(req);
  if (!parameters.file_content) {
    // redirect to management-top.
    res.redirect('/management/image');
    return;
  }
  // consoleLogger.debug('parameters', parameters);

  // ---
  // IDによる対象データ取得
  // ---
  const image = await dataSource.getRepository(Image).findOneBy({ id: parameters.id })
  if (image == null) {
    throw new Error('could not find the image id: ' + parameters.id)
  }
  // consoleLogger.debug('image: ', image)

  // 画像の所有者ユーザーID確認
  const user_id = req.user ? req.user.id : 0;
  if (user_id != image.userId) {
    // ユーザーが異なる場合はエラー
    const errorMessage = 'image data were modified by the invalid user.';
    // consoleLogger.error(errorMessage)
    res.json({ status: 'failure', data: null, message: errorMessage });
    return false;
  }
  // 画像ID
  let image_id = image.id;
  // 画像 mime type
  let fileName = image.fileName;
  // 画像 mime type
  let fileMimetype = image.fileMimetype;
  // サーバー上の保存位置
  let filePath = image.filePath;
  // URLパス
  let urlPath = image.fileUrl;

  // ---
  // ファイル保存、DB登録
  // ---
  // ファイル画像データ
  const targetImageData = String(parameters.file_content);
  // 画像UPLOADエラー
  let errorMessages: Array<any> = [];

  // ファイルデータサイズ > 0
  if (targetImageData == '') {
    errorMessages.push({ filename: parameters.file_name, message: 'image size is zero. : ' })
  }

  // アップロードファイルサイズ確認
  if (targetImageData.length > serverConfig.app.image_management.maxSize) {
    errorMessages.push({ filename: parameters.file_name, message: 'image size is too big! : ' + targetImageData.length })
  }

  // mimetype 対応確認
  if (!serverConfig.app.image_management.mimeType.includes(parameters.file_mimetype)) {
    errorMessages.push({ filename: parameters.file_name, message: 'image mime_type is invalid: ' + parameters.file_mimetype })
  }
  // consoleLogger.debug('errorMessages: ', errorMessages);

  if (errorMessages.length == 0) {
    // ---
    // 既存ファイルの削除
    // ---
    // 画像ファイルの物理削除
    if (fs.existsSync(path.join(APP_ROOT, filePath))) {
      fs.rmSync(path.join(APP_ROOT, filePath));
    }

    // ---
    // ファイルを保存・配置
    // ---
    // 保存するファイル名は同じファイル名が生じるケースを考えてDate.now()をつけたす
    let uploadFileExt = path.extname(parameters.file_name);
    let saveFilename = `${path.basename(parameters.file_name, uploadFileExt)}-${Date.now()}${uploadFileExt}`;

    // サーバー上の保存位置
    let savedDir = `${serverConfig.app.image_management.savedImageDir}/${req.user.id}/`;
    if (!fs.existsSync(path.join(APP_ROOT, 'public', savedDir))) {
      // 保存先ディレクトリが無い場合は作成
      fs.mkdirSync(path.join(APP_ROOT, 'public', savedDir), { recursive: true, mode: 0o777 });
    }
    // file path
    filePath = `public/${savedDir}${saveFilename}`;
    // URL path
    urlPath = `/${savedDir}${saveFilename}`;
    // file name
    fileName = parameters.file_name;
    // mime type
    fileMimetype = parameters.file_mimetype;

    // メモリ上にあるファイルをサーバーパスへ移動させる
    // ファイル保存
    const decode = Buffer.from(parameters.file_content, "base64");
    // ファイル出力
    fs.writeFileSync(filePath, decode);
  }

  // ---
  // DB更新
  // ---

  // 生成データ作成
  let imageData = {
    userId: user_id,
    fileName: fileName,
    fileMimetype: fileMimetype,
    filePath: filePath,
    fileUrl: urlPath
  };
  // consoleLogger.debug('imageData: ', imageData)

  // 生成実行
  const updatedImage = await dataSource
        .createQueryBuilder()
        .update(Image)
        .set(imageData)
        .where("id = :id", { id: image_id })
        .execute();

  // (4). レスポンスデータ作成、レスポンス
  const resData: any = { status: 'failure', data: imageData };
  if (updatedImage.affected !== undefined && updatedImage.affected === 1) {
    resData.status = 'success';
  }
  res.json(resData);

  // consoleLogger.info('--- run /api/images/:id #update (patch) --- end. ---')
})

// ------------------------------------------------------------------------------------------
// #delete
// ------------------------------------------------------------------------------------------
imagesRouter.delete('/:id', isAuthenticatedForApi, async function (req, res, next) {
  // consoleLogger.info('--- run /api/images/:id #delete --- start. ---')

  // (1). パラメータ取得
  const parameters = getAllParameters(req);
  // consoleLogger.debug('parameters', parameters);

  // (2). 生成データ作成
  const image = await dataSource.getRepository(Image).findOneBy({ id: parameters.id })
  // consoleLogger.debug('image: ', image);

  if (image == null) {
    // 見つからない場合、レスポンスデータ作成、レスポンス
    const resData = { status: 'failure', data: null };
    res.json(resData);
  } else {
    // (3). DBアクセス、データ削除実行
    const deletedImage = await dataSource.getRepository(Image).softDelete(image.id);
    // consoleLogger.debug('deletedImage: ', deletedImage);

    // (4). レスポンスデータ作成、レスポンス
    const resData: any = { status: 'failure', data: image };
    if (deletedImage.affected !== undefined && deletedImage.affected === 1) {
      resData.status = 'success';
    }
    res.json(resData);
  }

  // consoleLogger.info('--- run /api/images/:id #delete --- end. ---')
})

export default imagesRouter
