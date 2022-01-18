/**
 * User管理 Restful API
 *
 * http method   URI                   Controller#Action        http status code
 * -------------+---------------------+------------------------+------------------
 *      GET      /api/users            users#index (get list)   200 (OK)
 *      POST     /api/users            users#create             200 (OK) / 201 (Created)
 *      GET      /api/users/:id        users#show               200 (OK)
 *      PUT      /api/users/:id        users#update             200 (OK) / 204 (No Content)
 *      PATCH    /api/users/:id        users#update             200 (OK) / 204 (No Content)
 *      DELETE   /api/users/:id        users#delete             204 (NO Content)
 *
 */

// Express
import express from 'express'
// console logger
import consoleLogger from '../../lib/log/consoleLogger'

// express router
const usersRouter = express.Router()

// ------------------------------------------------------------------------------------------
// #index
// ------------------------------------------------------------------------------------------
usersRouter.get('/', function (req: express.Request, res: express.Response, next: express.NextFunction) {
  consoleLogger.info('--- run /api/users #index --- start. ---')

  // (1). get parameters for conditions
  // (2). DB access
  // (3). make & send the response data.
  // res.json({ routed: 'users#index' })
  res.send('routed: users#index')

  consoleLogger.info('--- run /api/users #index --- end. ---')
})

// ------------------------------------------------------------------------------------------
// #create
// ------------------------------------------------------------------------------------------
usersRouter.post('/', function (req: express.Request, res: express.Response, next: express.NextFunction) {
  consoleLogger.info('--- run /api/users/ #create --- start. ---')

  // (1). パラメータ取得
  // (2). DB情報（column）を取得
  // (3). 生成データの key 一覧を作成
  // (4). 生成データ作成
  // (5). create it.
  // (6). APIレスポンスデータ作成、返信
  // res.json({ routed: 'users#create' })
  res.send('routed: users#create')

  consoleLogger.info('--- run /api/users/ #create --- end. ---')
})

// ------------------------------------------------------------------------------------------
// #show
// ------------------------------------------------------------------------------------------
usersRouter.get('/:id', function (req: express.Request, res: express.Response, next: express.NextFunction) {
  consoleLogger.info('--- run /api/users/:id #show --- start. ---')

  // (1). パラメータ取得
  // (2). 対応する個人データ取得
  // (3). APIレスポンスデータ作成、返信
  // res.json({ routed: 'users#show' })
  res.send('routed: users#show')

  consoleLogger.info('--- run /api/users/:id #show --- end. ---')
})

// ------------------------------------------------------------------------------------------
// #update
// ------------------------------------------------------------------------------------------
usersRouter.put('/:id', function (req: express.Request, res: express.Response, next: express.NextFunction) {
  consoleLogger.info('--- run /api/users/:id #update --- start. ---')

  // (1). パラメータ取得
  // (2). DB情報（column）を取得
  // (3). 生成データの key 一覧を作成
  // (4). 生成データ作成
  // (5). update it.
  // (6). 更新後の個人データを取得
  // (7). APIレスポンスデータ作成、返信
  // res.json({ routed: 'users#update' })
  res.send('routed: users#update')

  consoleLogger.info('--- run /api/users/:id #update --- end. ---')
})


// ------------------------------------------------------------------------------------------
// #update (patch)
// ------------------------------------------------------------------------------------------
usersRouter.patch('/:id', function (req: express.Request, res: express.Response, next: express.NextFunction) {
  consoleLogger.info('--- run /api/users/:id #update (patch) --- start. ---')

  // (1). パラメータ取得
  // (2). DB情報（column）を取得
  // (3). 生成データの key 一覧を作成
  // (4). 既存データを取得
  // (5). 生成データ作成
  // (6). update it.
  // (7). 更新後の個人データを取得
  // (8). APIレスポンスデータ作成、返信
  // res.json({ routed: 'users#update (patch)' })
  res.send('routed: users#update (patch)')

  consoleLogger.info('--- run /api/users/:id #update (patch) --- end. ---')
})

// ------------------------------------------------------------------------------------------
// #delete
// ------------------------------------------------------------------------------------------
usersRouter.delete('/:id', function (req: express.Request, res: express.Response, next: express.NextFunction) {
  consoleLogger.info('--- run /api/users/:id #delete --- start. ---')

  // (1). パラメータ取得
  // (2). データ削除
  // (3). APIレスポンスデータ作成、返信
  // res.json({ routed: 'users#delete' })
  res.send('routed: users#delete')

  consoleLogger.info('--- run /api/users/:id #delete --- end. ---')
})

export default usersRouter
