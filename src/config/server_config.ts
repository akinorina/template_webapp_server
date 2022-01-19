/**
 * サーバー設定データ
 */

// ----
// [xx]. 設定 (default)
// ----
const serverConfig = {
  app_name: "template_webapp",
  server: {
    session: {
      secret: "secret",
      resave: true,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 3600000
      }
    },
    static: {
      static_file_path_root: "./public"
    },
    view: {
      type: "twig",
      template_file_path_root: "./templates/views"
    }
  },
  database: {},
  smtp: {
    host: 'localhost',
    port: 1025,
    secure: false,  // true for 465, false for other ports
    auth: {
      user: 'xxx',
      pass: 'xxx'
    }
  },
  // ユーザー登録時送信メール
  regist_user: {
    // 管理者への送信
    to_admin: {
      from: 'Example Systems <hello@example.com>',
      to: 'Akinori Nakata <akinori.na@gmail.com>',
      subject: '新規登録情報',
      // テンプレートファイル text
      template_text_file_path: 'registration_complete/admin_text.twig',
      // テンプレートファイル html
      template_html_html_path: 'registration_complete/admin_html.twig'
    },
    // ユーザーへの送信
    to_user: {
      from: 'Example Systems <hello@example.com>',
      subject: 'ご登録ありがとうございます。',
      // テンプレートファイル text
      template_text_file_path: 'registration_complete/user_text.twig',
      // テンプレートファイル html
      template_html_file_path: 'registration_complete/user_html.twig'
    }
  }
}

// ----
// [xx].
// ----


export default serverConfig;
