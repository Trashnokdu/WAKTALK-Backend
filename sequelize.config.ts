import { SequelizeOptions } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
dotenv.config();

const config: SequelizeOptions = {
  dialect: 'mysql',
  host: process.env.MYSQL_URL,
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: 'waktalk',
  models: [__dirname + '/models'],
};

export default config;
