import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from 'prisma/prisma.service';
import { TenantModule } from 'src/tenant/tenant.module';
import { MailModule } from 'src/mail/mail.module';
import { UserModule } from './user/user.module';
import { OrganizationModule } from './organization/organization.module';
import { ElectronicInvoicingConfigModule } from './electronic-invoicing-config/electronic-invoicing-config.module';
import { IssuancePointModule } from './issuance-point/issuance-point.module';

@Module({
  imports: [
    AuthModule,
    TenantModule,
    MailModule,
    UserModule,
    OrganizationModule,
    ElectronicInvoicingConfigModule,
    IssuancePointModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
