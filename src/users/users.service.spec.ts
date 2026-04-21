import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

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
    expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: 123 },
    });
  });

  it('create delegates to prisma', () => {
    service.create({
      name: 'John',
      email: 'john@example.com',
      role: Role.ADMIN,
    });
    expect(prismaServiceMock.user.create).toHaveBeenCalledWith({
      data: { name: 'John', email: 'john@example.com', role: Role.ADMIN },
    });
  });

  it('update delegates to prisma', () => {
    service.update(5, {
      name: 'Jane',
      email: 'jane@example.com',
      role: Role.USER,
    });
    expect(prismaServiceMock.user.update).toHaveBeenCalledWith({
      where: { id: 5 },
      data: { name: 'Jane', email: 'jane@example.com', role: Role.USER },
    });
  });

  it('remove delegates to prisma', () => {
    service.remove(7);
    expect(prismaServiceMock.user.delete).toHaveBeenCalledWith({
      where: { id: 7 },
    });
  });
});
