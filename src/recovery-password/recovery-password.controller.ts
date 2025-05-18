import { Controller, Post, Body, Req } from '@nestjs/common';
import { RecoveryPasswordService } from './recovery-password.service';

@Controller('recovery-password')
export class RecoveryPasswordController {
  constructor(
    private readonly recoveryPasswordService: RecoveryPasswordService,
  ) {}

  @Post()
  async recoverPassword(
    @Body()
    body: {
      email: string;
    },
    @Req() req: Request,
  ) {
    const subdomain = req['tenant-subdomain'];
    return this.recoveryPasswordService.recoverPassword(body.email, subdomain);
  }

  @Post('validate')
  async validateRecoveryPassword(
    @Body()
    body: {
      hash: string;
    },
  ) {
    return this.recoveryPasswordService.validateRecoveryPassword(body.hash);
  }

  @Post('update')
  async updatePassword(
    @Body()
    body: {
      hash: string;
      password: string;
    },
    @Req() req: Request,
  ) {
    const subdomain = req['tenant-subdomain'];
    return this.recoveryPasswordService.updatePassword(
      body.hash,
      body.password,
      subdomain,
    );
  }
}
