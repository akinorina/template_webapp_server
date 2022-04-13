// passport
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

// DB access by TypeORM
import dataSource from './dataSource'
import { User } from './entity/User'

// console logger
import consoleLogger from './lib/log/consoleLogger'

// Passport serialize / deserialize
passport.serializeUser(function (user: any, done) {
  done(null, user)
})
passport.deserializeUser(function (user: any, done) {
  done(null, user)
})

// Local Strategy
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async function (username, password, done) {
    // 検索条件
    const options: any = {
      where: {
        email: username,
        password: password
      },
      take: 1
    }
    // consoleLogger.debug('--- options: ', options)

    try {
      // DBアクセス
      // DBからユーザーを検索
      const result: any = await dataSource.getRepository(User).findAndCount(options)
      // consoleLogger.debug('--- passport.use() --- result: ', result)

      if (result[1] === 1) {
        // 認証成功
        const targetUser = { id: '', name: '', email: '' }
        targetUser.id = result[0][0].id
        targetUser.name = result[0][0].familyName + result[0][0].firstName
        targetUser.email = result[0][0].email
        // consoleLogger.debug('--- targetUser: ', targetUser);
        return done(null, targetUser)
      } else {
        // 認証失敗
        return done(null, false, { message: '認証に失敗しました。' })
      }
    } catch (err) {
      return done(err)
    }
  }
))

export default passport
