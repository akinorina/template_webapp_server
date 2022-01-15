//
import log4js from 'log4js'
import { access } from './logger'

export default (options:any = {}) => {
  options = options || {} // オプションを指定する場合はそちらを使う
  options.level = options.level || 'auto' // ない場合、autoを設定
  return log4js.connectLogger(access, options) // ログ設定 Expressのアクセスログと結びつける
}
