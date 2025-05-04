import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: true,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });
  }

  async sendPasswordResetMail(
    to: string,
    name: string,
    tenantName: string,
    link: string,
  ) {
    const subject = `${tenantName}: Restablecimiento de tu contraseña`;

    const htmlBody = `
      <p><span>Hola, ${name}:</span></p>
      <p><span>Recibimos tu solicitud para restablecer tu contraseña. Para continuar, haz clic en el siguiente enlace:</span></p>
      <p><a href="${link}">${link}</a></p>
      <p><span>Por razones de seguridad, este enlace expirará en 24 horas. Si no solicitaste este cambio, puedes ignorar este mensaje.</span></p>
      <p><span>¡Gracias por confiar en nosotros!</span></p>
    `;

    await this.transporter.sendMail({
      from: `"${this.configService.get('EMAIL_USER_NAME')}" <${this.configService.get('EMAIL_USER')}>`,
      to,
      subject,
      html: htmlBody,
    });
  }
}
