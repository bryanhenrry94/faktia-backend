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
      if (!origin) return callback(null, true); // Permitir llamadas sin origen (como Postman)
      if (process.env.NODE_ENV === 'development') return callback(null, true); // Permitir en test

      console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);

      const allowedDomain = /\.faktia\.lat$/; // Permitir cualquier subdominio de faktia.lat

      if (allowedDomain.test(new URL(origin).hostname)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'tenant-subdomain'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
