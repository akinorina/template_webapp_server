import express from 'express'

// DB access by TypeORM
import { getConnection, getRepository, Like } from "typeorm"

// passport
import passport from '../../passport'

// libs
import { getAllParameters } from '../../lib/libServer'

// console logger
// import consoleLogger from '../../lib/log/consoleLogger'

// router
const router = express.Router()

// ------------------------------------------------------------------------------------------
// Local Strategy - Routing
// ------------------------------------------------------------------------------------------
router.post('/login', passport.authenticate('local', { failWithError: true }),
  function (req, res) {
    // consoleLogger.debug('--- login success ---');
    res.status(200).json({ status: 'success', user: req.user })
  }
)

// ------------------------------------------------------------------------------------------
// logout
// ------------------------------------------------------------------------------------------
router.get('/logout', function (req, res) {
  req.logout()
  res.status(200).json({ status: 'success' })
})

// ------------------------------------------------------------------------------------------
// status
// ------------------------------------------------------------------------------------------
router.get('/status', function (req, res) {
  if (req.res && res.req.hasOwnProperty('user')) {
    res.status(200).json({ status: 'success', user: res.req.user })
  } else {
    res.status(200).json({ status: 'success', user: { id: null, name: null, email: null } })
  }
})

export default router
