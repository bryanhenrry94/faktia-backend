import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from 'prisma/prisma.service';
import { TenantModule } from 'src/tenant/tenant.module';
import { MailModule } from 'src/mail/mail.module';
import { UserModule } from './user/user.module';
import { ElectronicInvoicingConfigModule } from './electronic-invoicing-config/electronic-invoicing-config.module';
import { IssuancePointModule } from './issuance-point/issuance-point.module';
import { MembershipsModule } from './memberships/memberships.module';
import { RecoveryPasswordModule } from './recovery-password/recovery-password.module';

@Module({
  imports: [
    AuthModule,
    TenantModule,
    MailModule,
    UserModule,
    ElectronicInvoicingConfigModule,
    IssuancePointModule,
    MembershipsModule,
    RecoveryPasswordModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
