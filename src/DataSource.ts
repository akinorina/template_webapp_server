/**
 * data source for typeorm
 * 
 */
import "reflect-metadata"
import { DataSource } from "typeorm"
import dotenv from 'dotenv'

dotenv.config()

const databaseOptions: any = {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: false,
  entities: [ process.env.DB_PATH_TYPEORM_ENTITIES ],
  migrations: [ process.env.DB_PATH_TYPEORM_MIGRATIONS ],
  subscribers: [ process.env.DB_PATH_TYPEORM_SUBSCRIBERS ],
  cli: {
    entitiesDir: process.env.DB_PATH_TYPEORM_CLI_ENTITIES_DIR,
    migrationsDir: process.env.DB_PATH_TYPEORM_CLI_MIGRATIONS_DIR,
    subscribersDir: process.env.DB_PATH_TYPEORM_CLI_SUBSCRIBERS_DIR,
  }
}

export default new DataSource(databaseOptions)
