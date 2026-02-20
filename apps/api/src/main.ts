import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { ZodValidationPipe } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
  
  const allowedOrigins = new Set([
    process.env.URL_API,
    process.env.URL_WEB,
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ].filter(Boolean));

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      try {
        if (
          allowedOrigins.has(origin) ||
          origin.startsWith('http://localhost') ||
          origin.startsWith('http://127.0.0.1') ||
          origin.startsWith('https://localhost')
        ) {
          return callback(null, true);
        }
      } catch (err) {
      }

      if (process.env.NODE_ENV !== 'production') return callback(null, true);

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  });

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
