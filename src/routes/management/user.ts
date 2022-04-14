/**
 * router - management - user
 */

// Express
import express from 'express'
// nodemailer
// import nodemailer from 'nodemailer'
// path
import path from 'path'
// moment
// import moment from 'moment'

// DB access by TypeORM
import dataSource from '../../dataSource'
import { User } from '../../entity/User'

// console logger
// import consoleLogger from '../../lib/log/consoleLogger'

// libs
import { isAuthenticated } from '../../lib/libAuth'
import { getAllParameters } from '../../lib/libServer'
// import Mailer from '../../lib/Mailer'

// サーバー設定
// import serverConfig from '../../config/server_config'

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

  // パラメータ設定
  const options = { skip: 0, take: 10 }

  // DB access
  const users = await dataSource.getRepository(User).find(options)
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

  // DB access
  const user = await dataSource.getRepository(User).findOneBy({ id: parameters.id })
  // consoleLogger.debug('--- user: ', user)

  // render page.
  const viewValues = { login_user: req.user, User: user }
  res.render('management/user/detail', viewValues)
})

// ---
// 管理画面 - ユーザー - 編集画面への遷移
// ---
router.get('/:id/edit', isAuthenticated, async function (req: express.Request, res: express.Response, next: express.NextFunction) {
  // パラメータ取得
  const parameters = getAllParameters(req)
  // consoleLogger.debug('parameters', parameters)

  // DB access
  const user = await dataSource.getRepository(User).findOneBy({ id: parameters.id })
  // consoleLogger.debug('--- user: ', user)

  // render page.
  const viewValues = { login_user: req.user, User: user }
  res.render('management/user/edit', viewValues)
})

// ---
// 管理画面 - ユーザー - 削除画面への遷移
// ---
router.get('/:id/delete', isAuthenticated, async function (req: express.Request, res: express.Response, next: express.NextFunction) {
  // パラメータ取得
  const parameters = getAllParameters(req)
  // consoleLogger.debug('parameters', parameters)

  // DB access
  const user = await dataSource.getRepository(User).findOneBy({ id: parameters.id })
  // consoleLogger.debug('--- user: ', user)

  // render page.
  const viewValues = { login_user: req.user, User: user }
  res.render('management/user/delete', viewValues)
})

// ---
// 管理画面 - ユーザー - 編集画面からSUBMIT (新規)
// ---
router.post('/', isAuthenticated, async function (req: express.Request, res: express.Response, next: express.NextFunction) {
  // パラメータ取得
  const parameters = getAllParameters(req)
  // consoleLogger.debug('parameters', parameters)

  // 生成データ作成
  // create it.
  const user = new User()
  user.familyName = parameters.familyName
  user.firstName = parameters.firstName
  user.familyNameKana = parameters.familyNameKana
  user.firstNameKana = parameters.firstNameKana
  user.email = parameters.email
  user.password = parameters.password
  user.userType = parameters.userType
  const savedUser = await user.save()
  // consoleLogger.debug('savedUser: ', savedUser)

  // // 登録情報
  // const registData: any = {
  //   createdAt: moment(savedUser.createdAt).format("YYYY/M/D H:mm:ss"),
  //   name: savedUser.name,
  //   nameKana: savedUser.nameKana,
  //   email: savedUser.email,
  //   userType: savedUser.userType
  // }

  // (4). ユーザー登録告知メール送信
  // const myMailer = new Mailer(serverConfig.smtp);

  // // メール送信: to admin
  // myMailer.sendMaiilWithTemplates({
  //   from: serverConfig.app.send_mails.regist_user.to_admin.from,
  //   to:  serverConfig.app.send_mails.regist_user.to_admin.to,
  //   subject:  serverConfig.app.send_mails.regist_user.to_admin.subject,
  //   templateData: registData,
  //   templateTextFilePath: serverConfig.app.send_mails.regist_user.to_admin.template_text_file_path,
  //   templateHtmlFilePath: serverConfig.app.send_mails.regist_user.to_admin.template_html_html_path,
  // })

  // // メール送信: to user
  // myMailer.sendMaiilWithTemplates({
  //   from: serverConfig.app.send_mails.regist_user.to_user.from,
  //   to: registData.name + ' <' + registData.email + '>',
  //   subject: serverConfig.app.send_mails.regist_user.to_user.subject,
  //   templateData: registData,
  //   templateTextFilePath: serverConfig.app.send_mails.regist_user.to_user.template_text_file_path,
  //   templateHtmlFilePath: serverConfig.app.send_mails.regist_user.to_user.template_html_file_path,
  // })

  // render page.
  const viewValues = { login_user: req.user, User: savedUser }
  res.render('management/user/detail', viewValues)
})

// ---
// 管理画面 - ユーザー - 編集画面からSUBMIT (更新)
// ---
router.post('/:id', isAuthenticated, async function (req: express.Request, res: express.Response, next: express.NextFunction) {
  // パラメータ取得
  const parameters = getAllParameters(req)
  // consoleLogger.debug('parameters', parameters)

  // 既存データ取得
  const user = await dataSource.getRepository(User).findOneBy({ id: parameters.id })
  if (user === null) { throw new Error('could not find the data.')  }
  // consoleLogger.debug('user: ', user)

  // データ新規保存
  user.familyName = parameters.familyName
  user.firstName = parameters.firstName
  user.familyNameKana = parameters.familyNameKana
  user.firstNameKana = parameters.firstNameKana
  user.email = parameters.email
  user.password = parameters.password
  user.userType = parameters.userType
  // consoleLogger.debug('user: ', user)
  // 保存
  const savedUser = await dataSource.getRepository(User).save(user)
  // consoleLogger.debug('savedUser: ', savedUser)

  // render page.
  const viewValues = { login_user: req.user, User: savedUser }
  res.render('management/user/detail', viewValues)
})

// ---
// 管理画面 - ユーザー - 削除画面からSUBMIT (削除)
// ---
router.post('/:id/delete', isAuthenticated, async function (req: express.Request, res: express.Response, next: express.NextFunction) {
  // パラメータ取得
  const parameters = getAllParameters(req)
  // consoleLogger.debug('parameters', parameters)

  // IDによる対象データ取得
  const user = await dataSource.getRepository(User).findOneBy({ id: parameters.id })
  // consoleLogger.debug('user: ', user)
  if (user === null) {
    // 見つからないケース
    res.redirect('/management/user/')
    return
  }

  // 削除実行
  await dataSource.getRepository(User).softDelete (user.id)

  // redirect to user top.
  res.redirect('/management/user/')
})

export default router
