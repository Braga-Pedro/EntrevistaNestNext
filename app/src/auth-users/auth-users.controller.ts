import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { AuthUsersService } from './auth-users.service';
import { CreateAuthUserDto } from './dto/create-auth-user.dto';
import { UpdateAuthUserDto } from './dto/update-auth-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth-users')
@UseGuards(AuthGuard('jwt'))
export class AuthUsersController {
  constructor(private readonly authUsersService: AuthUsersService) {}

  @Post()
  create(@Body() createAuthUserDto: CreateAuthUserDto) {
    return this.authUsersService.create(createAuthUserDto);
  }

  @Get()
  findAll() {
    return this.authUsersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authUsersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthUserDto: UpdateAuthUserDto) {
    return this.authUsersService.update(+id, updateAuthUserDto);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authUsersService.remove(+id);
  }
}
