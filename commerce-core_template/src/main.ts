import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Ensures every response (success & error) actually matches the
  // { success, ... } / { success: false, statusCode, message, ... } shape
  // documented in Swagger via SwaggerSuccess/SwaggerCreated/SwaggerBadRequest/etc.
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Kings Brew API')
    .setDescription(
      'Coffee Shop Backend API — coffee ordering platform covering ' +
        'auth, categories, products, cart, checkout, orders, payments, ' +
        'reviews, favorites, order status tracking, and audit logging.',
    )
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Enter the JWT access token returned by /auth/login',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT ?? 3000;

  await app.listen(port);

  console.log(`Server running on http://localhost:${port}`);

  console.log(`Swagger running on http://localhost:${port}/api`);
}

void bootstrap();
