import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  const prismaServiceMock = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll delegates to prisma', () => {
    service.findAll();
    expect(prismaServiceMock.user.findMany).toHaveBeenCalled();
  });

  it('findOne delegates to prisma', () => {
    service.findOne(123);
    expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({ where: { id: 123 } });
  });

  it('create delegates to prisma', () => {
    service.create('John');
    expect(prismaServiceMock.user.create).toHaveBeenCalledWith({ data: { name: 'John' } });
  });

  it('update delegates to prisma', () => {
    service.update(5, 'Jane');
    expect(prismaServiceMock.user.update).toHaveBeenCalledWith({ where: { id: 5 }, data: { name: 'Jane' } });
  });

  it('remove delegates to prisma', () => {
    service.remove(7);
    expect(prismaServiceMock.user.delete).toHaveBeenCalledWith({ where: { id: 7 } });
  });
});
