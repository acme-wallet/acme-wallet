import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import path from 'node:path';
import { envSchema } from './common/configs/env.schema';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '../../../.env'),
      validate: (config) => envSchema.parse(config),
    }),
    UsersModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
