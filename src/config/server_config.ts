/**
 * サーバー設定データ
 */

// ----
// [1]. 設定 (default)
// ----
const serverConfig: any = {
  // server設定
  server: {
    // port
    port: "3000",

    // session
    session: {
      secret: "secret",
      resave: true,
      saveUninitialized: false,
      cookie: {
        domain: undefined,
        httpOnly: true,
        secure: false,
        maxAge: 3600000
      }
    },

    // static file
    static: {
      static_file_path_root: "./public"
    },

    // view
    view: {
      type: "njk",
      template_file_path_root: "./templates/views"
    },

    // CORS対応実装
    cors: {
      allowed_origins: [ 'http://localhost:4000' ]
    }
  },

  // database
  database: {},

  // smtp server
  smtp: {
    host: 'localhost',
    port: 1025,
    secure: false,  // true for 465, false for other ports
    auth: {
      user: 'xxx',
      pass: 'xxx'
    }
  },

  // application
  app: {
    // application 名称
    name: "template_webapp",

    // 画像管理
    image_management: {
      maxSize: 2 * 1024 * 1024, // 2MB
      mimeType: ['image/png', 'image/jpeg'],
      savedImageDir: 'image_manager',
    },

    // メール送信設定
    send_mails: {
      // ユーザー登録時
      regist_user: {
        // 管理者への送信
        to_admin: {
          from: 'Example Systems <hello@example.com>',
          to: 'Akinori Nakata <akinori.na@gmail.com>',
          subject: '新規登録情報',
          template_text_file_path: 'registration_complete/admin_text.njk',
          template_html_html_path: 'registration_complete/admin_html.njk'
        },
        // ユーザーへの送信
        to_user: {
          from: 'Example Systems <hello@example.com>',
          subject: 'ご登録ありがとうございます。',
          template_text_file_path: 'registration_complete/user_text.njk',
          template_html_file_path: 'registration_complete/user_html.njk'
        }
      }
    }
  }
}

// ----
// [2]. 環境変数による設定上書き処理
// ----

//
// server設定
//
// port番号
if (process.env.PORT) {
  serverConfig.server.port = process.env.PORT;
}
// cookie domain (default: undefined)
if (process.env.COOKIE_DOMAIN) {
  serverConfig.server.session.cookie.domain = process.env.COOKIE_DOMAIN;
}
// CORS allowed origin
if (process.env.CORS_ALLOWED_ORIGINS) {
  serverConfig.server.cors.allowed_origins = process.env.CORS_ALLOWED_ORIGINS.split(' ');
}

// SMTP server設定
if (process.env.SMTP_HOST) {
  serverConfig.smtp.host = process.env.SMTP_HOST;
}
if (process.env.SMTP_PORT) {
  serverConfig.smtp.port = Number(process.env.SMTP_PORT);
}
if (process.env.SMTP_AUTH_USER) {
  serverConfig.smtp.auth.user = process.env.SMTP_AUTH_USER;
}
if (process.env.SMTP_AUTH_PASSWORD) {
  serverConfig.smtp.auth.pass = process.env.SMTP_AUTH_PASSWORD;
}

export default serverConfig;
