// req.user が使えるようにする。
declare namespace Express {
  export interface Request {
      user: any;
  }
}
