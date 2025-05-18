import { Module } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { MembershipsController } from './memberships.controller';
import { PrismaService } from 'prisma/prisma.service';
import { TenantContextService } from 'src/tenant/tenant-context.service';
import { TenantService } from 'src/tenant/tenant.service';
import { MailService } from 'src/mail/mail.service';

@Module({
  controllers: [MembershipsController],
  providers: [
    MembershipsService,
    TenantService,
    TenantContextService,
    PrismaService,
    MailService,
  ],
})
export class MembershipsModule {}
