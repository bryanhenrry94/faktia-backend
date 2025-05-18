import { Module } from '@nestjs/common';
import { RecoveryPasswordService } from './recovery-password.service';
import { RecoveryPasswordController } from './recovery-password.controller';
import { TenantContextService } from 'src/tenant/tenant-context.service';
import { PrismaService } from 'prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { MembershipsService } from 'src/memberships/memberships.service';
import { TenantService } from 'src/tenant/tenant.service';

@Module({
  controllers: [RecoveryPasswordController],
  providers: [
    RecoveryPasswordService,
    PrismaService,
    MailService,
    MembershipsService,
    TenantService,
    TenantContextService,
  ],
})
export class RecoveryPasswordModule {}
