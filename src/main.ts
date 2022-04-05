#!/usr/bin/env node

/**
 * Module dependencies.
 */
import http from 'http';
import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

// file upload
import fileUpload from 'express-fileupload'

// CORS
import cors from 'cors';

// dataSource by TypeORM
import dataSource from './dataSource';

// session
import session from 'express-session';

// nunjucks
import nunjucks from 'nunjucks'

// サーバー設定
import serverConfig from './config/server_config'

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

// Routings
import indexRouter from './routes/index'
import samplesRouter from './routes/samples'
import authRouter from './routes/auth'
import managementIndexRouter from './routes/management/index'
import managementUserRouter from './routes/management/user'
import managementImageRouter from './routes/management/image'
// Routings for API
import apiAuthRouter from './routes/api/auth'
import apiUsersRouter from './routes/api/users'
import apiImagesRouter from './routes/api/images'

// dir: APP_ROOT
const APP_ROOT = path.join(__dirname, '../')

const app = express();

try {
  // make an DB connection.
  dataSource.initialize().then(() => {

    // nunjucks - view engine setup
    nunjucks.configure(path.join(APP_ROOT, serverConfig.server.view.template_file_path_root), {
      autoescape: true,
      express: app
    });
    app.set('view engine', serverConfig.server.view.type);

    app.use(express.json({limit: '100mb'}));
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(APP_ROOT, serverConfig.server.static.static_file_path_root)));

    // express-fileupload モジュールを使用
    app.use(fileUpload());

    // Session
    app.use(session(serverConfig.server.session));

    // CORS: Cross-Origin Resource Sharing 設定
    app.use(cors({
      origin: serverConfig.server.cors.allowed_origins,
      credentials: true
    }));

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
    app.use('/management/image', managementImageRouter);
    // Routings for API
    app.use('/api/auth', apiAuthRouter);
    app.use('/api/users', apiUsersRouter);
    app.use('/api/images', apiImagesRouter);

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

    // PORT
    app.set('port', serverConfig.server.port);
  })
  .catch((err) => {
    consoleLogger.error("Error during Data Source initialization", err)
    throw err
  })
} catch (err: any) {
  // output logs
  consoleLogger.error(err.message)
  applicationLogger.error('error', err.message)
}

// create HTTP server.
let server: any = http.createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(serverConfig.server.port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // console.log("....", typeof port);
  let bind: string = 'Port ' + serverConfig.server.port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      consoleLogger.error(bind + ' requires elevated privileges');
      applicationLogger.error('error', bind + ' requires elevated privileges');
      process.exit(1);

    case 'EADDRINUSE':
      consoleLogger.error(bind + ' is already in use');
      applicationLogger.error('error', bind + ' is already in use');
      process.exit(1);

    default:
      consoleLogger.error('Error: ', error);
      applicationLogger.error('Error: ', error);
      process.exit(1);
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr: any = server.address();
  console.info('Listening on ' + addr.port);
}
