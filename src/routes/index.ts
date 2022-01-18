/**
 * router - index (Top page)
 */

import express from 'express'

const router = express.Router()

router.get('/', function(req: express.Request, res: express.Response, next: express.NextFunction) {
  // render page.
  const viewValues = {}
  res.render('index', viewValues)
})

export default router
