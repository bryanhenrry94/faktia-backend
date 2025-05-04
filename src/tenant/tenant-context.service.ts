import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TenantContextService {
  constructor(private prisma: PrismaService) {}

  async resolveTenantId(subdomain: string): Promise<string> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { subdomain },
    });

    if (!tenant) {
      throw new NotFoundException(
        `Tenant not found for subdomain: ${subdomain}`,
      );
    }

    return tenant.id;
  }
}
