import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  async create(createCompanyDto: CreateOrganizationDto, subdomain: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: {
        subdomain: subdomain,
      },
    });

    if (!tenant) {
      throw new Error('Tenant not found');
    }

    return this.prisma.organization.create({
      data: {
        tenantId: tenant.id,
        taxId: createCompanyDto.taxId,
        legalName: createCompanyDto.legalName,
        tradeName: createCompanyDto.tradeName,
        establishmentNumber: createCompanyDto.establishmentNumber,
        accountingRequired: createCompanyDto.accountingRequired,
        specialTaxpayer: createCompanyDto.specialTaxpayer,
        largeTaxpayer: createCompanyDto.largeTaxpayer,
        rimpeRegimeTaxpayer: createCompanyDto.rimpeRegimeTaxpayer,
        rimpe: createCompanyDto.rimpe,
        withholdingAgent: createCompanyDto.withholdingAgent,
        city: createCompanyDto.city,
        phone: createCompanyDto.phone,
        address: createCompanyDto.address,
        logo: createCompanyDto.logo,
      },
    });
  }

  async findAll(subdomain: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: {
        subdomain,
      },
    });
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    return this.prisma.organization.findUnique({
      where: {
        tenantId: tenant.id,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.organization.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: string, updateCompanyDto: UpdateOrganizationDto) {
    return this.prisma.organization.update({
      where: {
        id,
      },
      data: {
        taxId: updateCompanyDto.taxId,
        legalName: updateCompanyDto.legalName,
        tradeName: updateCompanyDto.tradeName,
        establishmentNumber: updateCompanyDto.establishmentNumber,
        accountingRequired: updateCompanyDto.accountingRequired,
        specialTaxpayer: updateCompanyDto.specialTaxpayer,
        largeTaxpayer: updateCompanyDto.largeTaxpayer,
        rimpeRegimeTaxpayer: updateCompanyDto.rimpeRegimeTaxpayer,
        rimpe: updateCompanyDto.rimpe,
        withholdingAgent: updateCompanyDto.withholdingAgent,
        city: updateCompanyDto.city,
        phone: updateCompanyDto.phone,
        address: updateCompanyDto.address,
        logo: updateCompanyDto.logo,
      },
    });
  }

  remove(id: string) {
    return this.prisma.organization.delete({
      where: {
        id,
      },
    });
  }
}
