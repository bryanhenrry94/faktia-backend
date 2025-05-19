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
        taxId: createTenantDto.taxId,
        subdomain: createTenantDto.subdomain,
        plan: createTenantDto.plan,
        email: createTenantDto.email,
        tradeName: createTenantDto.tradeName,
        establishmentNumber: createTenantDto.establishmentNumber,
        accountingRequired: createTenantDto.accountingRequired,
        specialTaxpayer: createTenantDto.specialTaxpayer,
        largeTaxpayer: createTenantDto.largeTaxpayer,
        rimpeRegimeTaxpayer: createTenantDto.rimpeRegimeTaxpayer,
        rimpe: createTenantDto.rimpe,
        withholdingAgent: createTenantDto.withholdingAgent,
        city: createTenantDto.city,
        phone: createTenantDto.phone,
        address: createTenantDto.address,
        logo: createTenantDto.logo,
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
        taxId: updateTenantDto.taxId,
        name: updateTenantDto.name,
        subdomain: updateTenantDto.subdomain,
        plan: updateTenantDto.plan,
        email: updateTenantDto.email,
        tradeName: updateTenantDto.tradeName,
        establishmentNumber: updateTenantDto.establishmentNumber,
        accountingRequired: updateTenantDto.accountingRequired,
        specialTaxpayer: updateTenantDto.specialTaxpayer,
        largeTaxpayer: updateTenantDto.largeTaxpayer,
        rimpeRegimeTaxpayer: updateTenantDto.rimpeRegimeTaxpayer,
        rimpe: updateTenantDto.rimpe,
        withholdingAgent: updateTenantDto.withholdingAgent,
        city: updateTenantDto.city,
        phone: updateTenantDto.phone,
        address: updateTenantDto.address,
        logo: updateTenantDto.logo,
      },
    });
  }

  remove(id: string) {
    return this.prisma.tenant.delete({
      where: { id },
    });
  }
}
