// Routing for Passport
import express from 'express'

// passport
import passport from '../passport'

// router
const router = express.Router()

// Local Strategy - Routing
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/auth/miss',
  successRedirect: '/management'
}))

// login page.
router.get('/login', function (req, res, next) {
  // render page.
  const viewValues = { login_user: req.user }
  res.render('auth/login', viewValues)
})
// logout page.
router.get('/logout', function (req, res) {
  // logout.
  req.logout()
  // render page.
  const viewValues = { login_user: req.user }
  res.render('auth/logout', viewValues)
})
// miss page.
router.get('/miss', function (req, res, next) {
  // render page.
  const viewValues = { login_user: req.user }
  res.render('auth/miss', viewValues)
})

export default router
