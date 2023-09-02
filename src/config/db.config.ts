import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ShortenUrl, User } from '../entities';

export const DB_CONFIG: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [ShortenUrl, User],
  synchronize: true,
};
