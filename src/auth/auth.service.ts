import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'prisma/prisma.service';
import { TenantContextService } from 'src/tenant/tenant-context.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private tenantContextService: TenantContextService,
  ) {}

  async validateUser(email: string, password: string, subdomain: string) {
    const tenantId = await this.tenantContextService.resolveTenantId(subdomain);

    const user = await this.prisma.user.findFirst({
      where: { email, tenantId },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    return user;
  }

  async login(email: string, password: string, subdomain: string) {
    const user = await this.validateUser(email, password, subdomain);

    const payload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
    };

    return this.jwtService.sign(payload);
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    subdomain: string;
  }) {
    const { name, email, password, subdomain } = data;

    const tenantId = await this.tenantContextService.resolveTenantId(subdomain);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        tenantId,
      },
    });

    const payload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
