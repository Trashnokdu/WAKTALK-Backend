import { SequelizeOptions } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
dotenv.config();

const config: SequelizeOptions = {
  dialect: 'mysql',
  host: process.env.MYSQL_URL,
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: false,
  models: [__dirname + '/models'],
};

export default config;
