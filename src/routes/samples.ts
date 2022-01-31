/**
 * router - index (Top page)
 */

import express from 'express'
import path from 'path'
import fs from 'fs'

// dir: APP_ROOT
const APP_ROOT = path.join(__dirname, '../../')

const router = express.Router()

router.get('/', function(req: express.Request, res: express.Response, next: express.NextFunction) {
  // render page.
  const viewValues = {}
  res.render('samples/index', viewValues)
})

router.get('/sample001', function(req: express.Request, res: express.Response, next: express.NextFunction) {
  // render page.
  const viewValues = {}
  res.render('samples/sample001', viewValues)
})

router.get('/sample002', function(req: express.Request, res: express.Response, next: express.NextFunction) {
  // render page.
  const viewValues = {}
  res.render('samples/sample002', viewValues)
})

router.get('/sample003', function(req: express.Request, res: express.Response, next: express.NextFunction) {
  // render page.
  const viewValues = {}
  res.render('samples/sample003', viewValues)
})

router.post('/sample003', function(req: express.Request, res: express.Response, next: express.NextFunction) {
  // ファイル保存
  const decode = Buffer.from(req.body.file_content, "base64");
  // 拡張子
  let extName = '';
  switch (req.body.file_mimetype) {
    case 'image/png': extName = '.png'; break;
    case 'image/jpeg': extName = '.jpg'; break;
    case 'image/gif': extName = '.gif'; break;
  }
  // ファイルパス
  const sDirName = 'public/sample_images';
  const sFileName = path.basename(req.body.file_name, extName) + '-' + Date.now() + extName;
  // ディレクトリ確認・生成
  if (!fs.existsSync(path.join(APP_ROOT, sDirName))) {
    fs.mkdirSync(path.join(APP_ROOT, sDirName), { recursive: true, mode: 0o777 });
  }
  // ファイル出力
  fs.writeFileSync(path.join(APP_ROOT, sDirName, sFileName), decode);

  // render page.
  res.redirect('/samples/sample003_uploaded');
})

router.get('/sample003_uploaded', function(req: express.Request, res: express.Response, next: express.NextFunction) {
  // render page.
  const viewValues = {}
  res.render('samples/sample003_uploaded', viewValues)
})

export default router
