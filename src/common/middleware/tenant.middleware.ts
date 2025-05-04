import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Extract tenant from the headers
    const tenantSubdomain = req.headers['tenant-subdomain'] as string;

    if (!tenantSubdomain) {
      req['tenant-subdomain'] = null;
    } else {
      req['tenant-subdomain'] = tenantSubdomain;
    }

    next();
  }
}
