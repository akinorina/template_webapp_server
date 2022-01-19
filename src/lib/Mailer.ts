/**
 * サーバー設定 class
 *
 */
// nodemailer
import nodemailer from 'nodemailer'

import path from 'path'
import fs from 'fs'

// nunjucks
import nunjucks from 'nunjucks'

// console logger
import consoleLogger from './log/consoleLogger'

const APP_ROOT = path.join(__dirname, '../../')

export default class Mailer {
  //
  transporter: any;

  /**
   * constructor
   */
  constructor(transport_params: any) {
    // connect to smtp server.
    this.transporter = nodemailer.createTransport(transport_params);
    // consoleLogger.debug('transporter: ', this.transporter)
  }

  /**
   * テンプレートを使ってメールを送信
   *
   */
  async sendMaiilWithTemplates(send_params: any) {
    // nunjucks設定
    nunjucks.configure(path.join(APP_ROOT, 'templates/mail'), { autoescape: true });

    // text
    const mailText = nunjucks.render(send_params.templateTextFilePath, send_params.templateData);
    // consoleLogger.debug('mailText: ', mailText);

    // html
    const mailHtml = nunjucks.render(send_params.templateHtmlFilePath, send_params.templateData);
    // consoleLogger.debug('mailHtml: ', mailHtml);

    // send mail with defined transport object
    let info = await this.transporter.sendMail({
      from: send_params.from,
      to: send_params.to,
      subject: send_params.subject,
      text: mailText,
      html: mailHtml
    });
    // consoleLogger.debug("Message sent: %s", info);
  }
}
