import { Injectable } from '@nestjs/common';
import { CreateTenantDto } from 'src/tenant/dto/create-tenant.dto';
import { UpdateTenantDto } from 'src/tenant/dto/update-tenant.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  create(createTenantDto: CreateTenantDto) {
    return this.prisma.tenant.create({
      data: {
        name: createTenantDto.name,
        subdomain: createTenantDto.subdomain,
        plan: createTenantDto.plan,
        email: createTenantDto.email,
      },
    });
  }

  findAll() {
    return this.prisma.tenant.findMany({
      include: {
        memberships: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.tenant.findUnique({
      where: { id },
    });
  }

  findOneBySubdomain(subdomain: string) {
    return this.prisma.tenant.findUnique({
      where: { subdomain },
    });
  }

  update(id: string, updateTenantDto: UpdateTenantDto) {
    return this.prisma.tenant.update({
      where: { id },
      data: {
        name: updateTenantDto.name,
        subdomain: updateTenantDto.subdomain,
        plan: updateTenantDto.plan,
        email: updateTenantDto.email,
      },
    });
  }

  remove(id: string) {
    return this.prisma.tenant.delete({
      where: { id },
    });
  }
}
