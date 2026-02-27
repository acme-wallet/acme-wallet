import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import path from 'node:path';
import { envSchema } from './common/configs/env.schema';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '../../../.env'),
      validate: (config) => envSchema.parse(config),
    }),
    UsersModule,
    HealthModule,
    WalletModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
