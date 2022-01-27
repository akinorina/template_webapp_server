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
import { getConnection } from "typeorm"
import { Image } from '../../entity/Image'

// console logger
import consoleLogger from '../../lib/log/consoleLogger'

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
  const options = { where: { user_id: req.user.id } };

  // DB access
  const images = await Image.find(options)
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
// 管理画面 - 画像 - 編集画面からSUBMIT (新規)
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

  // make an DB connection.
  const connection = getConnection()

  // ---
  // ファイル保存、DB登録
  // ---
  // 単一の場合、配列に変換
  let imagelist = (!Array.isArray(parameters.__files.images)) ? [ parameters.__files.images ] : parameters.__files.images;
  imagelist.forEach(async (ele: any) => {
    let bValid = true;

    // アップロードファイルは20MB以内
    if (ele.size > serverConfig.app.image_management.maxSize) {
      consoleLogger.error('ele.size too big! : ', ele.size);
      bValid = false;
    }

    // mimetype 対応確認
    if (!serverConfig.app.image_management.mimeType.includes(ele.mimetype)) {
      consoleLogger.error('ele.mimetype bad type! : ', ele.mimetype);
      bValid = false;
    }

    if (bValid) {
      // ---
      // ファイルを保存・配置
      // ---
      // 保存するファイル名は同じファイル名が生じるケースを考えてDate.now()をつけたす
      let uploadFileExt = path.extname(ele.name);
      let saveFilename = `${path.basename(ele.name, uploadFileExt)}-${Date.now()}${uploadFileExt}`;

      // サーバー上の保存位置
      let savedDir = `${serverConfig.app.image_management.savedImageDir}/${req.user.id}/`;
      if (!fs.existsSync(path.join(APP_ROOT, 'public', savedDir))) {
        // 保存先ディレクトリが無い場合は作成
        fs.mkdirSync(path.join(APP_ROOT, 'public', savedDir), { recursive: true, mode: 0o777 });
      }
      let filePath = `public/${savedDir}${saveFilename}`;
      // URLパス
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
        name: parameters.name,
        user_id: req.user ? req.user.id : 0,
        filePath: filePath,
        fileUrl: urlPath
      };
      // consoleLogger.debug('image: ', image)

      // 生成実行
      await getConnection()
            .createQueryBuilder()
            .insert()
            .into(Image)
            .values(image)
            .execute();
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
  const image = await Image.findByIds(parameters.id)
  // consoleLogger.debug('--- image: ', image)

  // render page.
  const viewValues = { login_user: req.user, Image: image[0] }
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
  const image = await Image.findByIds(parameters.id)
  // consoleLogger.debug('--- image: ', image)

  // render page.
  const viewValues = { login_user: req.user, Image: image[0] }
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

  // IDによる対象データ取得
  const images = await Image.findByIds(parameters.id)
  // consoleLogger.debug('images[0]: ', images[0])
  
  // 画像ID
  let image_id = images[0].id;
  // サーバー上の保存位置
  let filePath = images[0].filePath;
  // URLパス
  let urlPath = images[0].fileUrl;

  // 画像ファイル指定がある場合はDBに画像を保存
  if (parameters.__files && parameters.__files.images) {
    // consoleLogger.debug('parameters', parameters);

    // ---
    // ファイル保存、DB登録
    // ---
    // 単一の場合、配列に変換
    let imageList = (!Array.isArray(parameters.__files.images)) ? [ parameters.__files.images ] : parameters.__files.images;
    let bValid = true;

    // アップロードファイルは20MB以内
    if (imageList[0].size > serverConfig.app.image_management.maxSize) {
      consoleLogger.error('imageList[0].size too big! : ', imageList[0].size);
      bValid = false;
    }

    // mimetype 対応確認
    if (!serverConfig.app.image_management.mimeType.includes(imageList[0].mimetype)) {
      consoleLogger.error('imageList[0].mimetype bad type! : ', imageList[0].mimetype);
      bValid = false;
    }

    if (bValid) {
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
      filePath = `public/${savedDir}${saveFilename}`;
      // URLパス
      urlPath = `/${savedDir}${saveFilename}`;

      // メモリ上にあるファイルをサーバーパスへ移動させる
      imageList[0].mv(path.join(APP_ROOT, filePath), (err: any) => {
        if(err)
          return res.status(500).send(err);
      })
    }
  }

  // ---
  // DB登録
  // ---

  // 生成データ作成
  const imageData = {
    user_id: req.user ? req.user.id : 0,
    name: parameters.name,
    filePath: filePath,
    fileUrl: urlPath
  };
  // consoleLogger.debug('imageData: ', imageData)

  // 生成実行
  await getConnection()
        .createQueryBuilder()
        .update(Image)
        .set(imageData)
        .where("id = :id", { id: image_id })
        .execute();

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

  // make an DB connection.
  // const connection = getConnection()

  // DB access
  const image = await Image.findByIds(parameters.id)
  // consoleLogger.debug('--- image: ', image)

  // render page.
  const viewValues = { login_user: req.user, Image: image[0] }
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
  const images = await Image.findByIds(parameters.id)
  const image = images[0]
  // consoleLogger.debug('image: ', image)

  // 画像ファイルの物理削除
  if (fs.existsSync(path.join(APP_ROOT, image.filePath))) {
    fs.rmSync(path.join(APP_ROOT, image.filePath));
  }

  // 削除実行
  await getConnection().getRepository(Image).softDelete(image.id)

  // redirect to user top.
  res.redirect('/management/image/')
})

export default router
