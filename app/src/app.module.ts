import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthUsersModule } from './auth-users/auth-users.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { AuthUsersService } from './auth-users/auth-users.service';
import { GroupsModule } from './groups/groups.module';

@Module({
  imports: [AuthUsersModule, PrismaModule, AuthModule, GroupsModule],
  controllers: [AppController],
  providers: [AppService, AuthUsersService, PrismaService, AuthService],
})
export class AppModule {}
