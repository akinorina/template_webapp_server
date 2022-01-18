import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'

// DB access by TypeORM
import { createConnection, Connection } from 'typeorm';

// session
import session from 'express-session';

// Passport
import passport from './passport';

// system logger
import systemLogger from './lib/log/systemLogger'
// access logger
import accessLogger from './lib/log/accessLogger'
// application logger
import applicationLogger from './lib/log/applicationLogger'
// console logger
import consoleLogger from './lib/log/consoleLogger'

// lib
import ServerConfig from './lib/ServerConfig'

// Routings
import indexRouter from './routes/index'
import samplesRouter from './routes/samples'
import authRouter from './routes/auth'
import managementIndexRouter from './routes/management/index'
import managementUserRouter from './routes/management/user'
// Routings for API
import apiAuthRouter from './routes/api/auth'
import apiUsersRouter from './routes/api/users'

const app = express();

try {
  // サーバー設定
  const serverConfig = new ServerConfig();

  // make an DB connection.
  createConnection('default').then((connection: Connection) => {

  // view engine setup
  app.set('views', path.join(__dirname, '../templates/views'));
  app.set('view engine', 'twig');

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, '../public')));

  // Session
  app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 1
    }
  }))

  // Passport
  app.use(passport.initialize())
  app.use(passport.session())

  // アクセス・ロガー 設定
  app.use(accessLogger())

  // Routings
  app.use('/', indexRouter);
  app.use('/samples', samplesRouter);
  app.use('/auth', authRouter);
  app.use('/management', managementIndexRouter);
  app.use('/management/user', managementUserRouter);
  // Routings for API
  app.use('/api/auth', apiAuthRouter);
  app.use('/api/users', apiUsersRouter);

  // systemLogger をExpressに実装
  app.use(systemLogger())

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  }).catch(error => { throw error });

  //
} catch (err: any) {
  // output logs
  consoleLogger.error(err.message)
  applicationLogger.error('error', err.message)
}

export default app;
