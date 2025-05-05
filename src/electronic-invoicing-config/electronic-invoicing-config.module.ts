import { Module } from '@nestjs/common';
import { ElectronicInvoicingConfigService } from './electronic-invoicing-config.service';
import { ElectronicInvoicingConfigController } from './electronic-invoicing-config.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [ElectronicInvoicingConfigController],
  providers: [ElectronicInvoicingConfigService, PrismaService],
})
export class ElectronicInvoicingConfigModule {}
