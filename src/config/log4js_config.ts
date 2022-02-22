// Log出力設定
import path from 'path'

const APP_ROOT = path.join(__dirname, '../../')

// ログ出力設定
// log4jsはルートロガーで使用するので、エクスポートに変更
export default {
  appenders: {
    // コンソール・ログ
    consoleLog: {
      // 出力方法
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: '%[%d %p%]: %m'
      }
    },
    // システム・ログ
    systemLog: {
      // 出力方法
      type: 'file',
      // システムログ出力先
      filename: path.join(APP_ROOT, './logs/system/system.log'),
      // 5MB
      maxLogSize: 5000000,
      // 世代管理は5ファイルまで、古いログファイルを gz で圧縮されていく
      backups: 5,
      // 圧縮
      compress: true
    },
    // アプリケーション・ログ
    applicationLog: {
      // 出力方法
      type: 'multiFile',
      //
      base: path.join(APP_ROOT, './logs/application/'),
      //
      property: 'key',
      // ファイルの拡張子はlogとする
      extension: '.log',
      // 5MB = 5 * 1024 * 1024 (bytes)
      maxLogSize: 5242880,
      // 世代管理は5ファイルまで、古いやつからgzで圧縮されていく
      backups: 5,
      //
      compress: true
    },
    // アクセス・ログ
    accessLog: {
      //
      type: 'dateFile',
      //
      filename: path.join(APP_ROOT, './logs/access/access.log'),
      // 日毎にファイル分割
      pattern: 'yyyy-MM-dd',
      // 5日分の世代管理設定
      numBackups: 5,
      //
      compress: true,
      //
      keepFileExt: true
    }
  },
  categories: {
    // デフォルト
    default: {
      // appenders
      appenders: ['consoleLog'],
      // 最小出力レベル
      level: 'ALL'
    },
    // システム
    system: {
      // appenders
      appenders: ['systemLog'],
      // 最小出力レベル
      level: 'ALL'
    },
    // アプリケーション
    application: {
      appenders: ['applicationLog'],
      level: 'ALL'
    },
    // アクセス
    access: {
      appenders: ['accessLog'],
      level: 'INFO'
    }
  }
}
