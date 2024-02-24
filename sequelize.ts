import { Sequelize } from 'sequelize-typescript';
import config from './sequelize.config';

const sequelize = new Sequelize(config);

export default sequelize;
