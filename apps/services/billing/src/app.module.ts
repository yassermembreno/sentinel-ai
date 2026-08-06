import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HealthModule } from './health/health.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { BillingModule } from './billing.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    DatabaseModule,
    BillingModule,
  ],
})
export class AppModule {}
