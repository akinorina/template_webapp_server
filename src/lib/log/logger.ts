import log4js from 'log4js'
import config from '../../config/log4js_config'

// logger設定
log4js.configure(config)

// アプリケーションロガー拡張
class ApplicationLogger {
  logger: any;
  trace: any;
  debug: any;
  info: any;
  warn: any;
  error: any;
  fatal: any;

  constructor() {
    this.logger = log4js.getLogger('application');

    this.trace = (key: string, message: string) => {
      const logger = this.logger;
      logger.addContext('key', key);
      logger['trace'](message);
    };
    this.debug = (key: string, message: string) => {
      const logger = this.logger;
      logger.addContext('key', key);
      logger['debug'](message);
    };
    this.info = (key: string, message: string) => {
      const logger = this.logger;
      logger.addContext('key', key);
      logger['info'](message);
    };
    this.warn = (key: string, message: string) => {
      const logger = this.logger;
      logger.addContext('key', key);
      logger['warn'](message);
    };
    this.error = (key: string, message: string) => {
      const logger = this.logger;
      logger.addContext('key', key);
      logger['error'](message);
    };
    this.fatal = (key: string, message: string) => {
      const logger = this.logger;
      logger.addContext('key', key);
      logger['fatal'](message);
    };
  }
}

// それぞれのログ種別ごとに作成、エクスポート
export const console = log4js.getLogger('default')
export const system = log4js.getLogger('system')
export const application = new ApplicationLogger()
export const access = log4js.getLogger('access')
