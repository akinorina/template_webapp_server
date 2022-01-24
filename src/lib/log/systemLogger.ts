//
import express from 'express'
import { system } from './logger'

export default function systemLogger (options: any = {}) {
  return (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    system.error(err.message)
    next(err)
  }
}
