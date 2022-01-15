/**
 * サーバー設定 class
 *
 */

import path from 'path'
import fs from 'fs'

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
    this.data = JSON.parse(fs.readFileSync(APP_ROOT + "config/server_config.json", "utf-8"));
  }
}
