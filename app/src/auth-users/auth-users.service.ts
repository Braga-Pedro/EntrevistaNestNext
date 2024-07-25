import { Injectable } from '@nestjs/common';
import { CreateAuthUserDto } from './dto/create-auth-user.dto';
import { UpdateAuthUserDto } from './dto/update-auth-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcrypt';

@Injectable()
export class AuthUsersService {

  constructor (private prisma: PrismaService) {
  }

  async create(createAuthUserDto: CreateAuthUserDto) {
    const hashedPassword = await hash(createAuthUserDto.password, 10);

    return this.prisma.authUsers.create({
      data: {
        name: createAuthUserDto.name,
        email: createAuthUserDto.email,
        password: hashedPassword
      },
    });
  }

  findAll() {
    return this.prisma.authUsers.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  findByEmail(email: string) {
    return this.prisma.authUsers.findUniqueOrThrow({
      where: {
        email
      }
    })
  }

  findOne(id: number) {
    return this.prisma.authUsers.findUniqueOrThrow({
      where: {
        id
      }
    });
  }

  async update(id: number, updateAuthUserDto: UpdateAuthUserDto) {
    const hashedPassword = await hash(updateAuthUserDto.password, 10);

    return this.prisma.authUsers.update({
      where: {
        id,
      },
      data:{
        name: updateAuthUserDto.name,
        email: updateAuthUserDto.email,
        password: hashedPassword
      }
    })
  }

  remove(id: number) {
    return this.prisma.authUsers.delete({
      where: {
        id
      }
    });
  }
}
