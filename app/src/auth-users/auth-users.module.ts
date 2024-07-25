import { Module } from '@nestjs/common';
import { AuthUsersService } from './auth-users.service';
import { AuthUsersController } from './auth-users.controller';

@Module({
  controllers: [AuthUsersController],
  providers: [AuthUsersService]
})
export class AuthUsersModule {}
