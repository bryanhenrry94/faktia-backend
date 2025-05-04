import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from 'prisma/prisma.service';
import { TenantModule } from 'src/tenant/tenant.module';
import { MailModule } from 'src/mail/mail.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, TenantModule, MailModule, UserModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
