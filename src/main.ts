import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TenantMiddleware } from './common/middleware/tenant.middleware';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.use((req, res, next) => new TenantMiddleware().use(req, res, next));
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: (origin, callback) => {
      // Permitir frontend local y sus subdominios
      const allowedOrigins = ['http://app.localhost:3000'];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // 🔥 Necesario para enviar cookies
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
