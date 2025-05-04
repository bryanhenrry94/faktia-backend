import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const host = req.hostname;
    const subdomain = host.split('.')[0];

    // Excluye dominios como "localhost:3000"
    if (subdomain === 'localhost' || /^[\d.]+$/.test(subdomain)) {
      req['tenantSubdomain'] = null;
    } else {
      req['tenantSubdomain'] = subdomain;
    }

    next();
  }
}
