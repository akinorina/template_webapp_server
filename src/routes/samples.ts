/**
 * router - index (Top page)
 */

import express from 'express'
import path from 'path'
import fs from 'fs'

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
  const base64data = req.body.file_content.split(',')[1];
  const decode = Buffer.from(base64data, "base64");
  // ファイルパス
  const sDirName = 'public/images_uploaded/';
  const sFileName = path.basename(req.body.file_name, '.png') + '-' + Date.now() + '.png';
  // ファイル出力
  fs.writeFileSync(path.join(__dirname, '../../' + sDirName + sFileName), decode);

  // render page.
  res.redirect('/samples/sample003_uploaded');
})

router.get('/sample003_uploaded', function(req: express.Request, res: express.Response, next: express.NextFunction) {
  // render page.
  const viewValues = {}
  res.render('samples/sample003_uploaded', viewValues)
})

export default router
