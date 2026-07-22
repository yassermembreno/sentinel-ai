import { Module } from '@nestjs/common';

import { HealthModule } from './health/health.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { CustomerModule } from './customer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HealthModule,
    DatabaseModule,
    CustomerModule,
  ],
})
export class AppModule {}
