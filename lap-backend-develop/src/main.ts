import 'dotenv/config';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import validationOptions from './utils/validation-options';
import { AllConfigType } from './config/config.type';
import { HttpLoggerMiddleware } from './common/middleware/http-logger.middleware';
// import './instrument.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    rawBody: true,
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfigType>);

  // Apply HTTP Logger middleware globally
  const httpLogger = new HttpLoggerMiddleware();
  app.use(httpLogger.use.bind(httpLogger));

  app.enableShutdownHooks();
  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: ['/'],
    },
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const options = new DocumentBuilder()
    .setTitle('Life Agent Portal API Docs (V1)')
    .setDescription('API documentation for Life Agent Portal')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  const appPort = configService.getOrThrow('app.port', { infer: true });
  // Commenting them due to stripe's rawBody request behavior in handleAccountWebhook request
  // app.use(bodyParser.json({ limit: '20b' }));
  app.use(
    bodyParser.json({
      limit: '20mb',
      verify: function (req: any, res, buf) {
        const url = req.originalUrl;
        if (url.startsWith('/api/v1/stripe')) {
          req.rawBody = buf.toString();
        }
      },
    }),
  );
  app.use(bodyParser.urlencoded({ limit: '10gb', extended: true }));
  // app.use(express.json({verify: (req,res,buf) => { req.rawBody = buf }}));

  await app.listen(appPort);
  console.log(`Running Port: ${appPort}`);
}
void bootstrap();
