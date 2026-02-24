import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [UsersModule, HealthModule, ChatModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
