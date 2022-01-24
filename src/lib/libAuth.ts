/**
 * 認証済みか判定
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
import express from 'express'

export function isAuthenticated (req: express.Request, res: express.Response, next: express.NextFunction) {
  if (req.isAuthenticated()) { // 認証済
    return next()
  } else { // 認証されていない
    res.redirect('/auth/login') // ログイン画面に遷移
  }
}

export function isAuthenticatedForApi (req: express.Request, res: express.Response, next: express.NextFunction) {
  if (req.isAuthenticated()) { // 認証済
    return next()
  } else { // 認証されていない
    // 認証失敗
    const responseData = {
      status: 'unauthorized',
      message: '未ログイン状態です。'
    }
    res.status(401).json(responseData)
  }
}
