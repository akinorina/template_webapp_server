import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'

// system logger
import systemLogger from './lib/log/systemLogger'
// access logger
import accessLogger from './lib/log/accessLogger'
// console logger
import consoleLogger from './lib/log/consoleLogger'

// lib
import ServerConfig from './lib/ServerConfig'

// Routings
import indexRouter from './routes/index'

// template_webapp サーバー設定
const serverConfig = new ServerConfig();
consoleLogger.debug('name:', serverConfig.data.app_name);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'twig');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// アクセス・ロガー 設定
app.use(accessLogger())

// Routings
app.use('/', indexRouter);

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

export default app;
