/**
 * router - index (Top page)
 */

import express from 'express'

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

export default router
