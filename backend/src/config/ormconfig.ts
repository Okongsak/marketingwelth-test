import { DataSourceOptions } from 'typeorm';
import { Article } from '../articles/article.entity';
import { User } from '../users/user.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const ormConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: +(process.env.POSTGRES_PORT || 5432),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'blogdb',
  entities: [Article, User],
  synchronize: process.env.TYPEORM_SYNC === 'true',
  logging: false,
};

export default ormConfig;
