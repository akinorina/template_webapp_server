export default {
  "name": process.env.DB_NAME,
  "type": process.env.DB_TYPE,
  "host": process.env.DB_HOST,
  "port": process.env.DB_PORT,
  "username": process.env.DB_USERNAME,
  "password": process.env.DB_PASSWORD,
  "database": process.env.DB_DATABASE,
  "synchronize": false,
  "logging": false,
  "entities": [ process.env.DB_PATH_TYPEORM_ENTITIES ],
  "migrations": [ process.env.DB_PATH_TYPEORM_MIGRATIONS ],
  "subscribers": [ process.env.DB_PATH_TYPEORM_SUBSCRIBERS ]
}
