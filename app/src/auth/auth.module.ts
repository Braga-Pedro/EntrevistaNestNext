import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthUsersModule } from 'src/auth-users/auth-users.module';
import { AuthUsersService } from 'src/auth-users/auth-users.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        ConfigModule.forRoot(),
        AuthUsersModule,
        PassportModule,
        AuthModule,
        JwtModule.register({
            secret: process.env.JWT_KEY,
            signOptions: {expiresIn: '60s'},
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, AuthUsersService, JwtStrategy],
    exports: [JwtModule, AuthService]
})
export class AuthModule {}
