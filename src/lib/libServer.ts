/**
 * libServer - サーバー一般の関数などを格納
 */

import express from 'express'

// console logger
import consoleLogger from './log/consoleLogger'

/**
 * get Parameters, Queries, body parameters
 */
export function getAllParameters (req: express.Request) {
  const params: { [key: string]: any } = {};

  // files
  if (req.files) {
    params['__files'] = req.files;
  }

  // params
  Object.keys(req.params).forEach((sKey: string) => {
    params[sKey] = req.params[sKey];
  })
  // body
  Object.keys(req.body).forEach((sKey: string) => {
    params[sKey] = req.body[sKey];
  })
  // query
  Object.keys(req.query).forEach((sKey: string) => {
    params[sKey] = req.query[sKey];
  })

  // consoleLogger.debug('--- params: ', params);
  return params
}
