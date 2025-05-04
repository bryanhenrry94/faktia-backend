import {
  Controller,
  Post,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  Res,
  Get,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './JwtAuthGuard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const subdomain = req['tenantSubdomain'];

    const token = await this.authService.login(
      body.email,
      body.password,
      subdomain,
    );

    return { access_token: token };
  }

  @Post('register')
  async register(
    @Body()
    body: {
      name: string;
      email: string;
      password: string;
    },
    @Req() req: Request,
  ) {
    const subdomain = req['tenantSubdomain'];

    return this.authService.register({
      name: body.name,
      email: body.email,
      password: body.password,
      subdomain,
    });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request) {
    const user = req['user'];
    return user;
  }
}
