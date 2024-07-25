import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthUsersService } from 'src/auth-users/auth-users.service';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly authUserService: AuthUsersService,
        private readonly jwtService: JwtService
    ){}
    
    async validateUser(email: string, password: string) {
        const user = await this.authUserService.findByEmail(email);

        if (!user || !compareSync(password, user.password)) {
            throw new UnauthorizedException('Email ou senha inválidos');
        }

        return user;
    }

    async login(user: any){
        const payload = { email: user.email , sub: user.id }

        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}
