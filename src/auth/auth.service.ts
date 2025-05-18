import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'prisma/prisma.service';
import { MembershipsService } from 'src/memberships/memberships.service';
import { TenantContextService } from 'src/tenant/tenant-context.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private tenantContextService: TenantContextService,
    private membershipsService: MembershipsService,
  ) {}

  async validateUser(email: string, password: string, subdomain: string) {
    // Check if the subdomain is valid
    const tenantId = await this.tenantContextService.resolveTenantId(subdomain);
    if (!tenantId) {
      throw new UnauthorizedException('Tenant no encontrado');
    }

    // Check if the user exists and validate password
    const user = await this.prisma.user.findFirst({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Check if the user is active
    if (!user.status || user.status !== 'active') {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Check if the user is a member of the tenant
    const membership = await this.membershipsService.exists(user.id, tenantId);
    if (!membership) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    // Check if the membership status is accepted
    if (membership.status !== 'accepted') {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Validate password
    if (!user.password) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    return user;
  }

  async login(email: string, password: string, subdomain: string) {
    const user = await this.validateUser(email, password, subdomain);

    const access_token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return { access_token };
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    subdomain: string;
  }) {
    const { name, email, password, subdomain } = data;

    // Check if the subdomain is valid
    const tenantId = await this.tenantContextService.resolveTenantId(subdomain);

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new UnauthorizedException('El usuario ya existe');
    }
    // Create the user
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Create a membership for the user in the tenant
    const membership = await this.membershipsService.create({
      userId: user.id,
      tenantId,
      role: 'user', // Default role
      invitedBy: null, // Set to null or the ID of the inviting user
      status: 'accepted', // Default status
      createdAt: new Date(),
    });

    const payload = {
      sub: user.id,
      email: user.email,
      tenantId: membership.tenantId,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
