import { Injectable } from '@nestjs/common';
import { CreateElectronicInvoicingConfigDto } from './dto/create-electronic-invoicing-config.dto';
import { UpdateElectronicInvoicingConfigDto } from './dto/update-electronic-invoicing-config.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ElectronicInvoicingConfigService {
  constructor(private prismaService: PrismaService) {}

  async create(
    createElectronicInvoicingConfigDto: CreateElectronicInvoicingConfigDto,
    subdomain: string,
  ) {
    const tenant = await this.prismaService.tenant.findUnique({
      where: {
        subdomain: subdomain,
      },
    });

    if (!tenant) {
      throw new Error('Tenant not found');
    }

    const digitalCertificateBytes = Buffer.from(
      String(createElectronicInvoicingConfigDto.digitalCertificate),
      'base64',
    );

    return this.prismaService.electronicInvoicingConfig.create({
      data: {
        tenantId: tenant.id,
        ...createElectronicInvoicingConfigDto,
        digitalCertificate: digitalCertificateBytes,
      },
    });
  }

  async findOneByDomain(subdomain: string) {
    const tenant = await this.prismaService.tenant.findUnique({
      where: {
        subdomain: subdomain,
      },
    });
    if (!tenant) {
      throw new Error('Tenant not found');
    }
    return this.prismaService.electronicInvoicingConfig.findUnique({
      where: {
        tenantId: tenant.id,
      },
      include: {
        tenant: true,
      },
    });
  }

  findOne(id: string) {
    return this.prismaService.electronicInvoicingConfig.findUnique({
      where: {
        id: id,
      },
      include: {
        tenant: true,
      },
    });
  }

  update(
    id: string,
    updateElectronicInvoicingConfigDto: UpdateElectronicInvoicingConfigDto,
  ) {
    const digitalCertificateBytes =
      updateElectronicInvoicingConfigDto.digitalCertificate
        ? Buffer.from(
            String(updateElectronicInvoicingConfigDto.digitalCertificate),
            'base64',
          )
        : undefined;

    return this.prismaService.electronicInvoicingConfig.update({
      where: {
        id: id,
      },
      data: {
        ...updateElectronicInvoicingConfigDto,
        digitalCertificate: digitalCertificateBytes,
      },
    });
  }

  remove(id: string) {
    return this.prismaService.electronicInvoicingConfig.delete({
      where: {
        id: id,
      },
    });
  }
}
