/**
 * Restful API
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
 * parameters:
 *  start: 取得開始位置 (0はじまり)
 *  limit: 取得最大数 (default: 10)
 *  q    : 文字列検索 (部分一致)
 *
 */

// Express
import express from 'express'

// libs
import { getAllParameters } from '../../lib/libServer'
import { isAuthenticatedForApi } from '../../lib/libAuth'

// DB access by TypeORM
import { getConnection, getRepository, Like } from "typeorm";
import { User } from '../../entity/User';

// console logger
// import consoleLogger from '../../lib/log/consoleLogger'

// express router
const usersRouter = express.Router()

// ------------------------------------------------------------------------------------------
// #index
// ------------------------------------------------------------------------------------------
usersRouter.get('/', isAuthenticatedForApi, async function (req, res, next) {
  // consoleLogger.info('--- run /api/users #index --- start. ---')

  // (1). パラメータ取得
  const parameters = getAllParameters(req);
  // consoleLogger.debug('parameters', parameters);

  // (2). DBアクセス
  const options: any = { skip: 0, take: 10, where: [] };
  if (parameters.start !== undefined && typeof parseInt(parameters.start) === 'number') {
    options.skip = parseInt(parameters.start);
  }
  if (parameters.limit !== undefined && typeof parseInt(parameters.limit) === 'number') {
    options.take = parseInt(parameters.limit);
  }
  if (typeof parameters.q === 'string') {
    options.where = [
      { name: Like('%' + parameters.q + '%') },
      { nameKana: Like('%' + parameters.q + '%') },
      { email: Like('%' + parameters.q + '%') }
    ];
  }
  // consoleLogger.debug('--- options: ', options);
  const result = await getConnection().getRepository(User).findAndCount(options);
  // consoleLogger.debug('--- ', result);

  // (3). レスポンスデータ作成、レスポンス
  const resData = {
    status: 'success',
    total: result[1],
    data: result[0]
  };
  res.json(resData);

  // consoleLogger.info('--- run /api/users #index --- end. ---')
})

// ------------------------------------------------------------------------------------------
// #create
// ------------------------------------------------------------------------------------------
usersRouter.post('/', isAuthenticatedForApi, async function (req, res, next) {
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

  // (4). レスポンスデータ作成、レスポンス
  const resData = { status: 'success', data: user };
  res.json(resData);

  // consoleLogger.info('--- run /api/users/ #create --- end. ---')
})

// ------------------------------------------------------------------------------------------
// #show
//   ID が該当するデータがない場合 data: null を返す
// ------------------------------------------------------------------------------------------
usersRouter.get('/:id', isAuthenticatedForApi, async function (req, res, next) {
  // consoleLogger.info('--- run /api/users/:id #show --- start. ---')

  // (1). パラメータ取得
  const parameters = getAllParameters(req);
  // consoleLogger.debug('parameters', parameters);

  // (2). DBアクセス、対応する個人データ取得
  const options: any = { id: parameters.id };
  const result = await getConnection().getRepository(User).findAndCount(options);
  // consoleLogger.debug('--- result: ', result);

  // (3). レスポンスデータ作成、レスポンス
  const resData: any = { status: 'success', data: null };
  if (result[1] === 1) {
    resData.data = result[0];
  }
  res.json(resData);

  // consoleLogger.info('--- run /api/users/:id #show --- end. ---')
})

// ------------------------------------------------------------------------------------------
// #update
// ------------------------------------------------------------------------------------------
usersRouter.put('/:id', isAuthenticatedForApi, async function (req, res, next) {
  // consoleLogger.info('--- run /api/users/:id #update --- start. ---')

  // (1). パラメータ取得
  const parameters = getAllParameters(req);
  // consoleLogger.debug('parameters', parameters);

  // (2). 生成データ作成
  const users = await User.findByIds(parameters.id);
  const user = users[0];
  if (user === undefined) {
    // 見つからない場合、レスポンスデータ作成、レスポンス
    const resData = { status: 'failure', data: null };
    res.json(resData);
  } else {
    if (parameters.name !== undefined) {
      user.name = parameters.name;
    }
    if (parameters.nameKana !== undefined) {
      user.nameKana = parameters.nameKana;
    }
    if (parameters.email !== undefined) {
      user.email = parameters.email;
    }
    if (parameters.password !== undefined) {
      user.password = parameters.password;
    }
    if (parameters.userType !== undefined) {
      user.userType = parameters.userType;
    }
    // consoleLogger.debug('user: ', user);

    // (3). DBアクセス、データ保存実行
    const savedUser = await getConnection().getRepository(User).save(user);
    // consoleLogger.debug('savedUser: ', savedUser);

    // (4). レスポンスデータ作成、レスポンス
    const resData = { status: 'success', data: savedUser };
    res.json(resData);
  }

  // consoleLogger.info('--- run /api/users/:id #update --- end. ---')
})


// ------------------------------------------------------------------------------------------
// #update (patch) 処理内容は #update と同様
// ------------------------------------------------------------------------------------------
usersRouter.patch('/:id', isAuthenticatedForApi, async function (req, res, next) {
  // consoleLogger.info('--- run /api/users/:id #update (patch) --- start. ---')

  // (1). パラメータ取得
  const parameters = getAllParameters(req);
  // consoleLogger.debug('parameters', parameters);

  // (2). 生成データ作成
  const users = await User.findByIds(parameters.id);
  const user = users[0];
  if (user === undefined) {
    // 見つからない場合、レスポンスデータ作成、レスポンス
    const resData = { status: 'failure', data: null };
    res.json(resData);
  } else {
    if (parameters.name !== undefined) {
      user.name = parameters.name;
    }
    if (parameters.nameKana !== undefined) {
      user.nameKana = parameters.nameKana;
    }
    if (parameters.email !== undefined) {
      user.email = parameters.email;
    }
    if (parameters.password !== undefined) {
      user.password = parameters.password;
    }
    if (parameters.userType !== undefined) {
      user.userType = parameters.userType;
    }
    // consoleLogger.debug('user: ', user);

    // (3). DBアクセス、データ保存実行
    const savedUser = await getConnection().getRepository(User).save(user);
    // consoleLogger.debug('savedUser: ', savedUser);

    // (4). レスポンスデータ作成、レスポンス
    const resData = { status: 'success', data: savedUser };
    res.json(resData);
  }

  // consoleLogger.info('--- run /api/users/:id #update (patch) --- end. ---')
})

// ------------------------------------------------------------------------------------------
// #delete
// ------------------------------------------------------------------------------------------
usersRouter.delete('/:id', isAuthenticatedForApi, async function (req, res, next) {
  // consoleLogger.info('--- run /api/users/:id #delete --- start. ---')

  // (1). パラメータ取得
  const parameters = getAllParameters(req);
  // consoleLogger.debug('parameters', parameters);

  // (2). 生成データ作成
  const users = await User.findByIds(parameters.id);
  const user = users[0];
  // consoleLogger.debug('user: ', user);

  if (user === undefined) {
    // 見つからない場合、レスポンスデータ作成、レスポンス
    const resData = { status: 'failure', data: null };
    res.json(resData);
  } else {
    // (3). DBアクセス、データ削除実行
    const deletedUser = await getConnection().getRepository(User).softDelete(user.id);
    // consoleLogger.debug('deletedUser: ', deletedUser);

    // (4). レスポンスデータ作成、レスポンス
    const resData: any = { status: 'failure', data: user };
    if (deletedUser.affected !== undefined && deletedUser.affected === 1) {
      resData.status = 'success';
    }
    res.json(resData);
  }

  // consoleLogger.info('--- run /api/users/:id #delete --- end. ---')
})

export default usersRouter
