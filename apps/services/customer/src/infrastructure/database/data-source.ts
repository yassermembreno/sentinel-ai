import 'dotenv/config';
import 'reflect-metadata';

import { DataSource } from 'typeorm';

import databaseConfig from './database.config';

const envProvider = {
  get<T>(key: string): T | undefined {
    return process.env[key] as T;
  },
};

export default new DataSource(databaseConfig(envProvider));
