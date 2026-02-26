import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [UsersModule, HealthModule, WalletModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
