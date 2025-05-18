import { Injectable } from '@nestjs/common';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { PrismaService } from 'prisma/prisma.service';
import { TenantContextService } from 'src/tenant/tenant-context.service';
import { TenantService } from 'src/tenant/tenant.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class MembershipsService {
  constructor(
    private prisma: PrismaService,
    private tenantService: TenantService,
    private tenantContextService: TenantContextService,
    private mailService: MailService,
  ) {}

  async invite(
    email: string,
    subdomain: string,
  ): Promise<{ status: boolean; message: string }> {
    if (!email || !subdomain) {
      return {
        status: false,
        message: 'Email y subdominio son requeridos',
      };
    }

    // Check if the tenant exists
    const tenant = await this.tenantService.findOneBySubdomain(subdomain);
    if (!tenant) {
      return {
        status: false,
        message: `No se encontró un tenant con el subdominio (${subdomain})`,
      };
    }

    // Check if the user already exists or create a new one
    const user = await this.prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    // Check if the membership already exists
    const existingMembership = await this.prisma.memberships.findFirst({
      where: {
        userId: user.id,
        tenantId: tenant.id,
      },
    });

    if (existingMembership) {
      return {
        status: false,
        message: 'La membresía ya existe para este usuario y tenant',
      };
    }

    // Create a new membership
    const newMembership = await this.prisma.memberships.create({
      data: {
        userId: user.id,
        tenantId: tenant.id,
        role: 'user',
        invitedBy: null,
        status: 'pending',
        createdAt: new Date(),
      },
    });

    // Generate the invitation URL
    const baseUrl =
      process.env.NODE_ENV === 'development'
        ? `http://${subdomain}.localhost:3000`
        : `https://${subdomain}.faktia`;
    const url = `${baseUrl}/invite/${newMembership.id}`;

    // Send an email to the user with the invitation link
    await this.mailService.sendInvitationEmail(
      email,
      user.name || 'Usuario',
      tenant.name,
      url,
    );

    return {
      status: true,
      message: `Invitación enviada a ${email} para el tenant ${tenant.name}`,
    };
  }

  create(createMembershipDto: CreateMembershipDto) {
    return this.prisma.memberships.create({
      data: {
        userId: createMembershipDto.userId,
        tenantId: createMembershipDto.tenantId,
        role: createMembershipDto.role,
        invitedBy: createMembershipDto.invitedBy,
        status: createMembershipDto.status,
        createdAt: new Date(),
      },
    });
  }

  async findAll(subdomain: string) {
    const tenantId = await this.tenantContextService.resolveTenantId(subdomain);

    return this.prisma.memberships.findMany({
      where: {
        tenantId,
      },
      include: {
        user: true,
        tenant: true,
      },
    });
  }

  async findAllByTenantId(tenantId: string) {
    const tenant = await this.tenantService.findOne(tenantId);

    if (!tenant) {
      throw new Error('Tenant not found');
    }

    return this.prisma.memberships.findMany({
      where: {
        tenantId: tenant.id,
      },
      include: {
        user: true,
        tenant: true,
      },
    });
  }

  acceptInvite(invitation: string) {
    return this.prisma.memberships.update({
      where: { id: invitation },
      data: {
        status: 'accepted',
      },
      include: {
        user: true,
        tenant: true,
      },
    });
  }

  async declineInvite(invitation: string) {
    const membership = await this.prisma.memberships.findUnique({
      where: { id: invitation },
    });
    if (!membership) {
      throw new Error('Membership not found');
    }
    await this.prisma.memberships.delete({
      where: { id: invitation },
    });
    return {
      status: true,
      message: 'Membresía rechazada',
    };
  }

  findOne(id: string) {
    return this.prisma.memberships.findUnique({
      where: { id },
      include: {
        user: true,
        tenant: true,
      },
    });
  }

  update(id: string, updateMembershipDto: UpdateMembershipDto) {
    return this.prisma.memberships.update({
      where: { id },
      data: {
        userId: updateMembershipDto.userId,
        tenantId: updateMembershipDto.tenantId,
        role: updateMembershipDto.role,
        invitedBy: updateMembershipDto.invitedBy,
        status: updateMembershipDto.status,
        createdAt: updateMembershipDto.createdAt,
      },
      include: {
        user: true,
        tenant: true,
      },
    });
  }

  remove(id: string) {
    return this.prisma.memberships.delete({
      where: { id },
      include: {
        user: true,
        tenant: true,
      },
    });
  }

  exists(userId: string, tenantId: string) {
    return this.prisma.memberships.findFirst({
      where: {
        userId,
        tenantId,
      },
    });
  }
}
