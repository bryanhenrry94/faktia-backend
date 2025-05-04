import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Extract tenant from the headers
    const tenantSubdomain = req.headers['tenantSubdomain'] as string;

    if (!tenantSubdomain) {
      req['tenantSubdomain'] = null;
    } else {
      req['tenantSubdomain'] = tenantSubdomain;
    }

    next();
  }
}
