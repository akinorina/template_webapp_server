/**
 * router - management
 */

// Express
import express from 'express'

// console logger
// import consoleLogger from '../../lib/log/consoleLogger'

// router
const router = express.Router()

// 管理画面TOP
router.get('/', function (req: express.Request, res: express.Response, next: express.NextFunction) {
  // view data.
  const viewValues = {}
  res.render('management/index', viewValues)
})

export default router
