import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { MembershipsService } from 'src/memberships/memberships.service';
import { TenantContextService } from 'src/tenant/tenant-context.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class RecoveryPasswordService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private tenantContextService: TenantContextService,
    private membershipsService: MembershipsService,
  ) {}

  async recoverPassword(email: string, subdomain: string) {
    // Check if the subdomain is valid
    const tenantId = await this.tenantContextService.resolveTenantId(subdomain);
    if (!tenantId) {
      throw new UnauthorizedException('Tenant no encontrado');
    }

    // Check if the user exists
    const user = await this.prisma.user.findFirst({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException(
        'Usuario no existe o no es miembro del tenant',
      );
    }

    // Check if the user is a member of the tenant
    const membership = await this.membershipsService.exists(user.id, tenantId);
    if (!membership) {
      throw new UnauthorizedException(
        'Usuario no existe o no es miembro del tenant',
      );
    }

    // Check if the membership status is accepted
    if (membership.status !== 'accepted') {
      throw new UnauthorizedException(
        'Usuario no existe o no es miembro del tenant',
      );
    }

    // Generate a token for password recovery
    const hash = await bcrypt.hash(user.id + Date.now().toString(), 10);
    const encodeHash = encodeURIComponent(hash);

    await this.prisma.recoveryPassword.create({
      data: {
        email: user.email,
        hash: encodeHash,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    let link = `https://${subdomain}.faktia/recovery-password/${encodeHash}`;

    if (process.env.NODE_ENV === 'development') {
      link = `http://${subdomain}.localhost:3000/recovery-password/${encodeHash}`;
    }

    // Send email to user with password recovery link
    await this.mailService.sendPasswordRecoveryEmail(
      user.email,
      user.name || 'usuario',
      subdomain,
      link,
    );

    return {
      status: 'success',
      message:
        'Se ha enviado un correo electrónico para recuperar la contraseña',
    };
  }

  async validateRecoveryPassword(hash: string) {
    const recoveryPassword = await this.prisma.recoveryPassword.findFirst({
      where: { hash },
    });

    if (!recoveryPassword) {
      throw new UnauthorizedException('Token no válido');
    }

    if (new Date() > recoveryPassword.expiresAt) {
      throw new UnauthorizedException('Token expirado');
    }

    return recoveryPassword;
  }

  async updatePassword(hash: string, password: string, subdomain: string) {
    const recoveryPassword = await this.validateRecoveryPassword(hash);

    // Check if the subdomain is valid
    const tenantId = await this.tenantContextService.resolveTenantId(subdomain);
    if (!tenantId) {
      throw new UnauthorizedException('Tenant no encontrado');
    }

    // Check if the user exists
    const user = await this.prisma.user.findFirst({
      where: { email: recoveryPassword.email },
    });
    if (!user) {
      throw new UnauthorizedException('El usuario no existe');
    }

    // Check if the user is a member of the tenant
    const membership = await this.membershipsService.exists(user.id, tenantId);
    if (!membership) {
      throw new UnauthorizedException(
        'Usuario no existe o no es miembro del tenant',
      );
    }

    // Check if the membership status is accepted
    if (membership.status !== 'accepted') {
      throw new UnauthorizedException(
        'Usuario no existe o no es miembro del tenant',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    this.deleteRecoveryPassword(hash);

    return {
      status: 'success',
      message: 'Contraseña actualizada correctamente',
    };
  }

  async deleteRecoveryPassword(hash: string) {
    const recoveryPassword = await this.prisma.recoveryPassword.findFirst({
      where: { hash },
    });

    if (!recoveryPassword) {
      throw new UnauthorizedException('Token no válido');
    }

    await this.prisma.recoveryPassword.delete({
      where: { id: recoveryPassword.id },
    });
  }
}
