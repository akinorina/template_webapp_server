/**
 * router - management - user
 */

// Express
import express from 'express'
// nodemailer
import nodemailer from 'nodemailer'
// path
import path from 'path'
// moment
import moment from 'moment'
// twig
import Twig from 'twig'
// nunjucks
import nunjucks from 'nunjucks'

// DB access by TypeORM
import { getConnection } from "typeorm"
import { User } from '../../entity/User'

// console logger
// import consoleLogger from '../../lib/log/consoleLogger'

// libs
import { isAuthenticated } from '../../lib/libAuth'
import { getAllParameters } from '../../lib/libServer'
import Mailer from '../../lib/Mailer'

// dir: APP_ROOT
const APP_ROOT = path.join(__dirname, '../../../')

// router
const router = express.Router()

// ---
// 管理画面 - ユーザー - TOP
// ---
router.get('/', isAuthenticated, async function (req: express.Request, res: express.Response, next: express.NextFunction) {
  // パラメータ取得
  const parameters = getAllParameters(req)
  // consoleLogger.debug('parameters', parameters)

  // make an DB connection.
  const connection = getConnection()

  // パラメータ設定
  const options = { skip: 0, take: 10 }

  // DB access
  const users = await User.find(options)
  // consoleLogger.debug('--- users: ', users)

  // render page.
  const viewValues = { login_user: req.user, Users: users }
  res.render('management/user/index', viewValues)
})

// ---
// 管理画面 - ユーザー - 新規作成画面表示
// ---
router.get('/new', isAuthenticated, function (req: express.Request, res: express.Response, next: express.NextFunction) {
  // render page.
  const viewValues = { login_user: req.user }
  res.render('management/user/new', viewValues)
})

// ---
// 管理画面 - ユーザー - 詳細
// ---
router.get('/:id', isAuthenticated, async function (req: express.Request, res: express.Response, next: express.NextFunction) {
  // パラメータ取得
  const parameters = getAllParameters(req)
  // consoleLogger.debug('parameters', parameters)

  // make an DB connection.
  const connection = getConnection()

  // DB access
  const user = await User.findByIds(parameters.id)
  // consoleLogger.debug('--- user: ', user)

  // render page.
  const viewValues = { login_user: req.user, User: user[0] }
  res.render('management/user/detail', viewValues)
})

// ---
// 管理画面 - ユーザー - 編集画面への遷移
// ---
router.get('/:id/edit', isAuthenticated, async function (req: express.Request, res: express.Response, next: express.NextFunction) {
  // パラメータ取得
  const parameters = getAllParameters(req)
  // consoleLogger.debug('parameters', parameters)

  // make an DB connection.
  const connection = getConnection()

  // DB access
  const user = await User.findByIds(parameters.id)
  // consoleLogger.debug('--- user: ', user)

  // render page.
  const viewValues = { login_user: req.user, User: user[0] }
  res.render('management/user/edit', viewValues)
})

// ---
// 管理画面 - ユーザー - 削除画面への遷移
// ---
router.get('/:id/delete', isAuthenticated, async function (req, res, next) {
  // パラメータ取得
  const parameters = getAllParameters(req)
  // consoleLogger.debug('parameters', parameters)

  // make an DB connection.
  const connection = getConnection()

  // DB access
  const user = await User.findByIds(parameters.id)
  // consoleLogger.debug('--- user: ', user)

  // render page.
  const viewValues = { login_user: req.user, User: user[0] }
  res.render('management/user/delete', viewValues)
})

// ---
// 管理画面 - ユーザー - 編集画面からSUBMIT (新規)
// ---
router.post('/', isAuthenticated, async function (req, res, next) {
  // パラメータ取得
  const parameters = getAllParameters(req)
  // consoleLogger.debug('parameters', parameters)

  // 生成データ作成
  // create it.
  const user = new User()
  user.name = parameters.name
  user.nameKana = parameters.nameKana
  user.email = parameters.email
  user.password = parameters.password
  user.userType = parameters.userType
  // user.createdAt = 'null'
  // user.updatedAt = 'null'
  // user.deletedAt = 'null'
  const savedUser = await user.save()
  // consoleLogger.debug('savedUser: ', savedUser)

  // 登録情報
  const registData: any = {
    createdAt: moment(savedUser.createdAt).format("YYYY/M/D H:mm:ss"),
    name: savedUser.name,
    nameKana: savedUser.nameKana,
    email: savedUser.email,
    userType: savedUser.userType
  }

  // (4). メール送信
  const myMailer = new Mailer({
    host: 'localhost',
    port: 1025,
    secure: false,  // true for 465, false for other ports
    auth: {
      user: 'xxx',
      pass: 'xxx'
    }
  });

  // メール送信: to admin
  myMailer.sendMaiilWithTemplates({
    from: process.env.REGIST_MAIL_TO_ADMIN_FROM,
    to: process.env.REGIST_MAIL_TO_ADMIN_TO,
    subject: process.env.REGIST_MAIL_TO_ADMIN_SUBJECT,
    templateData: registData,
    templateTextFilePath: process.env.REGIST_MAIL_TO_ADMIN_TEXT,
    templateHtmlFilePath: process.env.REGIST_MAIL_TO_ADMIN_HTML,
  })

  // メール送信: to customer
  myMailer.sendMaiilWithTemplates({
    from: process.env.REGIST_MAIL_TO_CUSTOMER_FROM,
    to: registData.name + ' <' + registData.email + '>',
    subject: process.env.REGIST_MAIL_TO_CUSTOMER_SUBJECT,
    templateData: registData,
    templateTextFilePath: process.env.REGIST_MAIL_TO_CUSTOMER_TEXT,
    templateHtmlFilePath: process.env.REGIST_MAIL_TO_CUSTOMER_HTML
  })

  // render page.
  const viewValues = { login_user: req.user, User: savedUser }
  res.render('management/user/detail', viewValues)
})

// ---
// 管理画面 - ユーザー - 編集画面からSUBMIT (更新)
// ---
router.post('/:id', isAuthenticated, async function (req, res, next) {
  // パラメータ取得
  const parameters = getAllParameters(req)
  // consoleLogger.debug('parameters', parameters)

  // 既存データ取得
  const users = await User.findByIds(parameters.id)
  const user = users[0]
  // consoleLogger.debug('user: ', user)

  // データ新規保存
  user.name = parameters.name
  user.nameKana = parameters.nameKana
  user.email = parameters.email
  user.password = parameters.password
  user.userType = parameters.userType
  const savedUser = await user.save()
  // consoleLogger.debug('savedUser: ', savedUser)

  // render page.
  const viewValues = { login_user: req.user, User: savedUser }
  res.render('management/user/detail', viewValues)
})

// ---
// 管理画面 - ユーザー - 削除画面からSUBMIT (削除)
// ---
router.post('/:id/delete', isAuthenticated, async function (req, res, next) {
  // パラメータ取得
  const parameters = getAllParameters(req)
  // consoleLogger.debug('parameters', parameters)

  // make an DB connection.
  const connection = getConnection()

  // IDによる対象データ取得
  const users = await User.findByIds(parameters.id)
  const user = users[0]
  // consoleLogger.debug('user: ', user)

  // 削除実行
  await connection.getRepository(User).softDelete(user.id)
  // consoleLogger.debug('removedUser: ', removedUser)

  // 削除後のデータ一覧取得
  const options = { skip: 0, take: 10 }
  const userlist = await User.find(options)
  // consoleLogger.debug('--- userlist: ', userlist)

  // redirect to user top.
  res.redirect('/management/user/')
})

export default router
