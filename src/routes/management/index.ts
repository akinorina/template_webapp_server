/**
 * router - management
 */

// Express
import express from 'express'

// libAuth
import { isAuthenticated } from '../../lib/libAuth'

// console logger
// import consoleLogger from '../../lib/log/consoleLogger'

// router
const router = express.Router()

// 管理画面TOP
router.get('/', isAuthenticated, function (req: express.Request, res: express.Response, next: express.NextFunction) {
  // view data.
  const viewValues = { login_user: req.user }
  res.render('management/index', viewValues)
})

export default router
