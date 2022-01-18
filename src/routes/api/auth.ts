import express from 'express'
import path from 'path'
import moment from 'moment'

// DB access by TypeORM
import { getConnection, getRepository, Like } from "typeorm"
import { User } from '../../entity/User'

// nodemailer
import nodemailer from 'nodemailer'

// passport
import passport from '../../passport'

// libs
import { getAllParameters } from '../../lib/libServer'

// twig
import Twig from 'twig'

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
  user.name = parameters.name;
  user.nameKana = parameters.nameKana;
  user.email = parameters.email;
  user.password = parameters.password;
  user.userType = parameters.userType;

  // (3). DBアクセス、データ保存実行
  const savedUser = await getConnection().getRepository(User).save(user);
  // consoleLogger.debug('savedUser: ', savedUser);

  // (4). メール送信: to admin
  // SMTPサーバー接続情報
  const transport_params: any = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,                         // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_AUTH_USER,
      pass: process.env.SMTP_AUTH_PASSWORD
    },
  }
  // connect to smtp server.
  const transporter = await nodemailer.createTransport(transport_params);
  // consoleLogger.debug('transporter: ', transporter)

  // 登録情報
  const registData: any = {
    createdAt: moment(savedUser.createdAt).format("YYYY/M/D H:mm:ss"),
    name: savedUser.name,
    nameKana: savedUser.nameKana,
    email: savedUser.email,
    userType: savedUser.userType
  }

  // to admin
  Twig.renderFile(path.join(__dirname, '../../../' + process.env.REGIST_MAIL_TO_ADMIN_TEXT), registData, async (err: Error, to_admin_mail_txt: string) => {
    Twig.renderFile(path.join(__dirname, '../../../' + process.env.REGIST_MAIL_TO_ADMIN_HTML), registData, async (err: Error, to_admin_mail_html: string) => {
      // send mail with defined transport object
      const sendmail_param = {
        from: process.env.REGIST_MAIL_TO_ADMIN_FROM,
        to: process.env.REGIST_MAIL_TO_ADMIN_TO,
        subject: process.env.REGIST_MAIL_TO_ADMIN_SUBJECT,
        text: to_admin_mail_txt,
        html: to_admin_mail_html,
      }
      let info = await transporter.sendMail(sendmail_param);
      // consoleLogger.debug("Message sent: %s", info);
    });
  });

  // to customer
  Twig.renderFile(path.join(__dirname, '../../../' + process.env.REGIST_MAIL_TO_CUSTOMER_TEXT), registData, async (err: Error, to_customer_mail_txt: string) => {
    Twig.renderFile(path.join(__dirname, '../../../' + process.env.REGIST_MAIL_TO_CUSTOMER_HTML), registData, async (err: Error, to_customer_mail_html: string) => {
      // send mail with defined transport object
      const sendmail_param = {
        from: process.env.REGIST_MAIL_TO_CUSTOMER_FROM,
        to: registData.name + ' <' + registData.email + '>',
        subject: process.env.REGIST_MAIL_TO_CUSTOMER_SUBJECT,
        text: to_customer_mail_txt,
        html: to_customer_mail_html,
      }
      let info = await transporter.sendMail(sendmail_param);
      // consoleLogger.debug("Message sent: %s", info);
    });
  });

  // (5). レスポンスデータ作成、レスポンス
  const resData = { status: 'success', data: user };
  res.json(resData);

  // consoleLogger.info('--- run /api/users/ #create --- end. ---')
})

export default router
