import { DataSourceOptions } from 'typeorm';

interface DatabaseConfigProvider {
  get<T = unknown>(key: string): T | undefined;
}

export default function databaseConfig(
  configService: DatabaseConfigProvider,
): DataSourceOptions {
  return {
    type: 'postgres',

    host: configService.get<string>('DB_HOST'),

    port: configService.get<number>('DB_PORT'),

    username: configService.get<string>('DB_USERNAME'),

    password: configService.get<string>('DB_PASSWORD'),

    database: configService.get<string>('DB_DATABASE'),

    synchronize: false,

    migrationsRun: false,

    migrations: [__dirname + '/migrations/*{.ts,.js}'],

    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  };
}
