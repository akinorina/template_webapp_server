FROM centos:centos7
# FROM node:14

# centos7 に Node.JS をインストール
WORKDIR /root
# RUN yum update -y
RUN yum install -y curl
RUN curl -sL https://rpm.nodesource.com/setup_14.x | bash -
RUN yum install -y nodejs

# アプリケーションディレクトリを作成する
WORKDIR /var/www/app

# アプリケーションの依存関係をインストールする
# ワイルドカードを使用して、package.json と package-lock.json の両方が確実にコピーされるようにします。
# 可能であれば (npm@5+)
COPY package*.json ./

RUN npm install
# 本番用にコードを作成している場合
# RUN npm install --only=production

# アプリケーションのソースをバンドルする
COPY . .
COPY .env.production .env

# ビルド
RUN npm run build

EXPOSE 3000

CMD [ "node", "dist/main.js" ]
