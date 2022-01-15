/**
 * サーバー設定 class
 *
 */

import path from 'path'
import fs from 'fs'

// .env 情報取得
import dotenv from 'dotenv'

const APP_ROOT = path.join(__dirname, '../../')

export default class ServerConfig {
  /**
   * サーバー設定値
   */
  data: any = {}

  /**
   * constructor
   */
  constructor() {
    // server_config.json 取得
    this.data = JSON.parse(fs.readFileSync(APP_ROOT + "config/server_config.json", "utf-8"));

    // .env 取得
    const result = dotenv.config()
    if (result.error) {
      throw result.error
    } else {
      // ここに .env で上書きする設定を記述
    }
  }
}
