import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
        tenantId: createUserDto.tenantId,
        role: createUserDto.role,
        status: createUserDto.status,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      include: {
        tenant: true,
      },
    });
  }

  findAllByTenantId(tenantId: string) {
    return this.prisma.user.findMany({
      where: { tenantId },
      include: {
        tenant: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: {
        name: updateUserDto.name,
        email: updateUserDto.email,
        tenantId: updateUserDto.tenantId,
        role: updateUserDto.role,
        status: updateUserDto.status,
      },
    });
  }

  async changePassword(id: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
