/**
 * log tests
 */
import express from 'express';

// systemロガー
import systemLogger from '../lib/log/systemLogger'
// accessロガー
import accessLogger from '../lib/log/accessLogger'
// applicationロガー
import applicationLogger from '../lib/log/applicationLogger'
// consoleロガー
import consoleLogger from '../lib/log/consoleLogger'

// アプリケーションログ出力
applicationLogger.trace('app1', '*** trace! 1 ***')
applicationLogger.debug('app1', '*** debug! 1 ***')
applicationLogger.info('app2', '*** info! 2 ***')
applicationLogger.warn('app2', '*** warn! 2 ***')
applicationLogger.error('app3', '*** error! 3 ***')
applicationLogger.fatal('app3', '*** fatal! 3 ***')
// コンソールログ出力
consoleLogger.trace('--- console.log : trace ---');
consoleLogger.debug('--- console.log : debug ---');
consoleLogger.info('--- console.log : info ---');
consoleLogger.warn('--- console.log : warn ---');
consoleLogger.error('--- console.log : error ---');
consoleLogger.fatal('--- console.log : fatal ---');

const router = express.Router();

/* GET users listing. */
router.get('/send', function(req, res, next) {
  res.send('respond with a resource');
});

// システムログ 意図的にエラーを起こすルート
router.get('/error', (req, res) => {
  throw new Error('システムログの出力テスト Errorです')
})

// アクセスログ テスト用コード
router.get('/access1', (req, res) => {
  res.status(200).send('access test 200')
})
router.get('/access2', (req, res) => {
  res.status(304).send('access test 304')
})
router.get('/access3', (req, res) => {
  res.status(404).send('access test 404')
})
router.get('/access4', (req, res) => {
  res.status(500).send('access test 500')
})

export default router
