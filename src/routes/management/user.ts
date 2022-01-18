/**
 * router - management - user
 */

// Express
import express from 'express'

// DB access by TypeORM
import { getConnection } from "typeorm"
import { User } from '../../entity/User'

// console logger
// import consoleLogger from '../../lib/log/consoleLogger'

// libs
import { getAllParameters } from '../../lib/libServer'

// router
const router = express.Router()

// ---
// 管理画面 - ユーザー - TOP
// ---
router.get('/', async function (req: express.Request, res: express.Response, next: express.NextFunction) {
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
  const viewValues = { Users: users }
  res.render('management/user/index', viewValues)
})

// ---
// 管理画面 - ユーザー - 新規作成画面表示
// ---
router.get('/new', function (req: express.Request, res: express.Response, next: express.NextFunction) {
  // render page.
  const viewValues = {}
  res.render('management/user/new', viewValues)
})

// ---
// 管理画面 - ユーザー - 詳細
// ---
router.get('/:id', async function (req: express.Request, res: express.Response, next: express.NextFunction) {
  // パラメータ取得
  const parameters = getAllParameters(req)
  // consoleLogger.debug('parameters', parameters)

  // make an DB connection.
  const connection = getConnection()

  // DB access
  const user = await User.findByIds(parameters.id)
  // consoleLogger.debug('--- user: ', user)

  // render page.
  const viewValues = { User: user[0] }
  res.render('management/user/detail', viewValues)
})

// ---
// 管理画面 - ユーザー - 編集画面への遷移
// ---
router.get('/:id/edit', async function (req: express.Request, res: express.Response, next: express.NextFunction) {
  // パラメータ取得
  const parameters = getAllParameters(req)
  // consoleLogger.debug('parameters', parameters)

  // make an DB connection.
  const connection = getConnection()

  // DB access
  const user = await User.findByIds(parameters.id)
  // consoleLogger.debug('--- user: ', user)

  // render page.
  const viewValues = { User: user[0] }
  res.render('management/user/edit', viewValues)
})

// ---
// 管理画面 - ユーザー - 削除画面への遷移
// ---
router.get('/:id/delete', async function (req, res, next) {
  // パラメータ取得
  const parameters = getAllParameters(req)
  // consoleLogger.debug('parameters', parameters)

  // make an DB connection.
  const connection = getConnection()

  // DB access
  const user = await User.findByIds(parameters.id)
  // consoleLogger.debug('--- user: ', user)

  // render page.
  const viewValues = { User: user[0] }
  res.render('management/user/delete', viewValues)
})

// ---
// 管理画面 - ユーザー - 編集画面からSUBMIT (新規)
// ---
router.post('/', async function (req, res, next) {
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

  // render page.
  const viewValues = { User: savedUser }
  res.render('management/user/detail', viewValues)
})

// ---
// 管理画面 - ユーザー - 編集画面からSUBMIT (更新)
// ---
router.post('/:id', async function (req, res, next) {
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
  const viewValues = { User: savedUser }
  res.render('management/user/detail', viewValues)
})

// ---
// 管理画面 - ユーザー - 削除画面からSUBMIT (削除)
// ---
router.post('/:id/delete', async function (req, res, next) {
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
