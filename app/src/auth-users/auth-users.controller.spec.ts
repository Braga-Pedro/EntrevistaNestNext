import { Test, TestingModule } from '@nestjs/testing';
import { AuthUsersController } from './auth-users.controller';
import { AuthUsersService } from './auth-users.service';

describe('AuthUsersController', () => {
  let controller: AuthUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthUsersController],
      providers: [AuthUsersService],
    }).compile();

    controller = module.get<AuthUsersController>(AuthUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
