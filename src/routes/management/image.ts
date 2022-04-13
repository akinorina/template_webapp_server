/**
 * router - management - image
 */

// Express
import express from 'express'
// path
import path from 'path'
// fs
import fs from 'fs'

// DB access by TypeORM
import dataSource from '../../dataSource';
import { Image } from '../../entity/Image'

// console logger
// import consoleLogger from '../../lib/log/consoleLogger'

// libs
import { isAuthenticated } from '../../lib/libAuth'
import { getAllParameters } from '../../lib/libServer'

// サーバー設定
import serverConfig from '../../config/server_config'

// dir: APP_ROOT
const APP_ROOT = path.join(__dirname, '../../../')

// router
const router = express.Router()

// ---
// 管理画面 - 画像 - TOP
// ---
router.get('/', isAuthenticated, async function (req: express.Request, res: express.Response, next: express.NextFunction) {
  // パラメータ取得
  const parameters = getAllParameters(req)
  // consoleLogger.debug('parameters', parameters)

  // パラメータ設定
  const options = { where: { userId: req.user.id } };

  // DB access
  const images = await dataSource.getRepository(Image).find(options)
  // consoleLogger.debug('--- images: ', images)

  // render page.
  const viewValues = { login_user: req.user, Images: images }
  res.render('management/image/index', viewValues)
})

// ---
// 管理画面 - 画像 - 新規作成画面表示
// ---
router.get('/new', isAuthenticated, function (req: express.Request, res: express.Response, next: express.NextFunction) {
  // render page.
  const viewValues = { login_user: req.user }
  res.render('management/image/new', viewValues)
})

// ---
// 管理画面 - 画像 - 新規登録画面からSUBMIT
// ---
router.post('/', isAuthenticated, async function (req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!req.user) {
    // user check.
    throw new Error('not login.');
  }

  // パラメータ取得
  const parameters = getAllParameters(req)
  if (!parameters.__files || !parameters.__files.images) {
    // redirect to management-top.
    res.redirect('/management/image');
    return;
  }
  // consoleLogger.debug('parameters', parameters);

  // ---
  // ファイル保存、DB登録
  // ---

  // 単一の場合、配列に変換
  let imageList = (!Array.isArray(parameters.__files.images)) ? [ parameters.__files.images ] : parameters.__files.images;
  imageList.forEach(async (ele: any) => {
    // 画像UPLOADエラー
    let errorMessages: Array<any> = [];

    // アップロードファイルは20MB以内
    if (ele.size > serverConfig.app.image_management.maxSize) {
      errorMessages.push({ filename: ele.name, message: 'image size is too big. : ' + ele.size })
    }

    // mimetype 対応確認
    if (!serverConfig.app.image_management.mimeType.includes(ele.mimetype)) {
      errorMessages.push({ filename: ele.name, message: 'image mime_type is invalid: ' + ele.mimetype })
    }

    if (errorMessages.length == 0) {
      // ---
      // ファイルを保存・配置
      // ---
      // 保存するファイル名は同じファイル名が生じるケースを考えて Date.now() をつけたす
      let uploadFileExt = path.extname(ele.name);
      let saveFilename = `${path.basename(ele.name, uploadFileExt)}-${Date.now()}${uploadFileExt}`;

      // サーバー上の保存位置
      let savedDir = `${serverConfig.app.image_management.savedImageDir}/${req.user.id}/`;
      if (!fs.existsSync(path.join(APP_ROOT, 'public', savedDir))) {
        // 保存先ディレクトリが無い場合は作成
        fs.mkdirSync(path.join(APP_ROOT, 'public', savedDir), { recursive: true, mode: 0o777 });
      }
      // file path
      let filePath = `public/${savedDir}${saveFilename}`;
      // URL path
      let urlPath = `/${savedDir}${saveFilename}`;

      // メモリ上にあるファイルをサーバーパスへ移動させる
      ele.mv(path.join(APP_ROOT, filePath), (err: any) => {
        if(err)
          return res.status(500).send(err);
      });

      // ---
      // DB登録
      // ---

      // 生成データ作成
      const image = {
        userId: req.user ? req.user.id : 0,
        fileName: path.basename(ele.name),
        fileMimetype: ele.mimetype,
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
        .execute()
    } else {
      let em = '';
      errorMessages.forEach((ele) => {
        em += (em === '' ? "" : "\n") + ele.message
      })
      // consoleLogger.error(em)
    }
  })

  // redirect page.
  res.redirect('/management/image')
})

// ---
// 管理画面 - 画像 - 詳細
// ---
router.get('/:id', isAuthenticated, async function (req: express.Request, res: express.Response, next: express.NextFunction) {
  // パラメータ取得
  const parameters = getAllParameters(req)
  // consoleLogger.debug('parameters', parameters)

  // DB access
  const image = await dataSource.getRepository(Image).findOneBy({ id: parameters.id })
  // consoleLogger.debug('--- image: ', image)

  // render page.
  const viewValues = { login_user: req.user, Image: image }
  res.render('management/image/detail', viewValues)
})

// ---
// 管理画面 - 画像 - 編集画面への遷移
// ---
router.get('/:id/edit', isAuthenticated, async function (req: express.Request, res: express.Response, next: express.NextFunction) {
  // パラメータ取得
  const parameters = getAllParameters(req)
  // consoleLogger.debug('parameters', parameters)

  // DB access
  const image = await dataSource.getRepository(Image).findOneBy({ id: parameters.id })
  // consoleLogger.debug('--- image: ', image)

  // render page.
  const viewValues = { login_user: req.user, Image: image }
  res.render('management/image/edit', viewValues)
})

// ---
// 管理画面 - 画像 - 編集画面からSUBMIT (更新)
// ---
router.post('/:id', isAuthenticated, async function (req, res, next) {
  // login user info.
  if (!req.user) {
    // user check.
    throw new Error('not login.');
  }
  // consoleLogger.debug('req.user: ', req.user);

  // パラメータ取得
  const parameters = getAllParameters(req);
  if (!parameters.__files || !parameters.__files.images) {
    // redirect page.
    res.redirect(`/management/image/${parameters.id}`)
    return;
  }
  // consoleLogger.debug('parameters', parameters);

  // ---
  // IDによる対象データ取得
  // ---
  const image = await dataSource.getRepository(Image).findOneBy({ id: parameters.id })
  if (image === null) {
    // redirect page.
    res.redirect('/management/image')
    return
  }
  // consoleLogger.debug('image: ', image)
  // (既存)画像ID
  let image_id = image.id;
  // (既存)画像ID
  let imageFilename = image.fileName;
  // (既存)画像 mime type
  let fileMimetype = image.fileMimetype;
  // (既存)サーバー上の保存位置
  let filePath = image.filePath;
  // (既存)URLパス
  let urlPath = image.fileUrl;

  // ---
  // ファイル保存、DB登録
  // ---
  // 単一の場合、配列に変換。しかしながら、以下では[0]のデータのみ扱う
  let imageList = (!Array.isArray(parameters.__files.images)) ? [ parameters.__files.images ] : parameters.__files.images;
  // consoleLogger.debug('imageList', imageList);

  // 画像UPLOADエラー
  let errorMessages: Array<any> = [];

  // アップロードファイルは20MB以内
  if (imageList[0].size > serverConfig.app.image_management.maxSize) {
    errorMessages.push({ filename: imageList[0].name, message: 'image size is too big. : ' + imageList[0].size })
  }

  // mimetype 対応確認
  if (!serverConfig.app.image_management.mimeType.includes(imageList[0].mimetype)) {
    errorMessages.push({ filename: imageList[0].name, message: 'image mime_type is invalid: ' + imageList[0].mimetype })
  }

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
    let uploadFileExt = path.extname(imageList[0].name);
    let saveFilename = `${path.basename(imageList[0].name, uploadFileExt)}-${Date.now()}${uploadFileExt}`;

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
    // original filename
    imageFilename = imageList[0].name;
    // mime-type
    fileMimetype = imageList[0].mimetype;

    // メモリ上にあるファイルをサーバーパスへ移動させる
    imageList[0].mv(path.join(APP_ROOT, filePath), (err: any) => {
      if(err)
        return res.status(500).send(err);
    })
  }

  // ---
  // DB登録
  // ---

  // 生成データ作成
  const imageData = {
    userId: req.user ? req.user.id : 0,
    fileName: imageFilename,
    fileMimetype: fileMimetype,
    filePath: filePath,
    fileUrl: urlPath
  };
  // consoleLogger.debug('imageData: ', imageData)

  // 生成実行
  await dataSource
    .createQueryBuilder()
    .update(Image)
    .set(imageData)
    .where("id = :id", { id: image_id })
    .execute()

  // redirect page.
  res.redirect(`/management/image/${image_id}`)
})

// ---
// 管理画面 - 画像 - 削除画面への遷移
// ---
router.get('/:id/delete', isAuthenticated, async function (req, res, next) {
  // パラメータ取得
  const parameters = getAllParameters(req)
  // consoleLogger.debug('parameters', parameters)

  // DB access
  const image = await dataSource.getRepository(Image).findOneBy({ id: parameters.id })
  // consoleLogger.debug('--- image: ', image)

  // render page.
  const viewValues = { login_user: req.user, Image: image }
  res.render('management/image/delete', viewValues)
})

// ---
// 管理画面 - 画像 - 削除画面からSUBMIT (削除)
// ---
router.post('/:id/delete', isAuthenticated, async function (req, res, next) {
  // パラメータ取得
  const parameters = getAllParameters(req)
  // consoleLogger.debug('parameters', parameters)

  // IDによる対象データ取得
  const image = await dataSource.getRepository(Image).findOneBy({ id: parameters.id })
  if (image === null) {
    // redirect to user top.
    res.redirect('/management/image/')
    return
  }
  // consoleLogger.debug('image: ', image)

  // 画像ファイルの物理削除
  if (fs.existsSync(path.join(APP_ROOT, image.filePath))) {
    fs.rmSync(path.join(APP_ROOT, image.filePath));
  }

  // 削除実行
  await dataSource.getRepository(Image).softDelete(image.id)

  // redirect to user top.
  res.redirect('/management/image/')
})

export default router
