import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { ZodValidationPipe } from 'nestjs-zod';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { DomainExceptionFilter } from './common/filters/domain-exception.filter';
import { Env } from './common/configs/env.schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<Env, true>);

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/api',
    apiReference({
      content: document,
    }),
  );

  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalFilters(new DomainExceptionFilter());

  const urlFrontend = configService.get('URL_FRONTEND', { infer: true });
  const allowedOrigins = new Set<string>(
    [urlFrontend].filter((value): value is string => Boolean(value)),
  );

  const corsOptions: CorsOptions = {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin) {
        return callback(null, true);
      }

      if (
        allowedOrigins.has(origin) ||
        origin.startsWith('http://localhost') ||
        origin.startsWith('http://127.0.0.1') ||
        origin.startsWith('https://localhost')
      ) {
        return callback(null, true);
      }

      if (configService.get('NODE_ENV', { infer: true }) !== 'production') {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
  };

  app.enableCors(corsOptions);

  await app.listen(configService.get('PORT', { infer: true }));
}

void bootstrap();
