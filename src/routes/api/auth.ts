import express from 'express'
import moment from 'moment'

// DB access by TypeORM
import dataSource from '../../dataSource'
import { User } from '../../entity/User'

// passport
import passport from '../../passport'

// libs
import { getAllParameters } from '../../lib/libServer'
import Mailer from '../../lib/Mailer'

// サーバー設定
import serverConfig from '../../config/server_config'

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

// ------------------------------------------------------------------------------------------
// regist
// ------------------------------------------------------------------------------------------
router.post('/regist', async function (req, res, next) {
  // consoleLogger.info('--- run /api/users/ #create --- start. ---')

  // (1). パラメータ取得
  const parameters = getAllParameters(req);
  // consoleLogger.debug('parameters', parameters);

  // (2). 生成データ作成
  const user = new User();
  user.familyName = parameters.familyName;
  user.firstName = parameters.firstName;
  user.familyNameKana = parameters.familyNameKana;
  user.firstNameKana = parameters.firstNameKana;
  user.email = parameters.email;
  user.password = parameters.password;
  user.userType = parameters.userType;

  // (3). DBアクセス、データ保存実行
  const savedUser = await dataSource.getRepository(User).save(user);
  // consoleLogger.debug('savedUser: ', savedUser);

  // // 登録情報
  // const registData: any = {
  //   createdAt: moment(savedUser.createdAt).format("YYYY/M/D H:mm:ss"),
  //   name: savedUser.name,
  //   nameKana: savedUser.nameKana,
  //   email: savedUser.email,
  //   userType: savedUser.userType
  // }

  // // (4). ユーザー登録告知メール送信
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

  // (5). レスポンスデータ作成、レスポンス
  const resData = { status: 'success', data: user };
  res.json(resData);

  // consoleLogger.info('--- run /api/users/ #create --- end. ---')
})

export default router
