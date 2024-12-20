{%- set components = cookiecutter.components.split(',') -%}
{%- set consumer = "consumer" in components -%}
import 'reflect-metadata';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './libs/logger';
import { AllExceptionsFilter } from './filters/all-exception.filter';
import { ValidationPipe } from './pipes/validation.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { INestApplication } from '@nestjs/common';
{%- if consumer %}
import { AmqpBrokerService } from './modules/amqp-broker/amqp-broker.service';
{%- endif %}
import { sleep } from './libs/utils';
import morgan from 'morgan';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

function initializeSwaggerDocumentation(
  app: NestFastifyApplication,
  swaggerPath: string,
) {
  const swaggerDocs = new DocumentBuilder()
    .setTitle('{{ cookiecutter.app_name }}')
    .setDescription('The {{ cookiecutter.app_name }} API description')
    .setVersion('1.0')
    .addTag('{{ cookiecutter.app_name }}')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerDocs);

  if (!existsSync('./public')) {
    mkdirSync('./public');
  }
  writeFileSync('./public/swagger-spec.json', JSON.stringify(document));
  SwaggerModule.setup(swaggerPath, app, document);
}

export async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const globalPrefix = '/api';
  const swaggerPath = `${globalPrefix}/swagger`;

  app.useLogger(logger);

  app.use(cookieParser());
  app.use(morgan('tiny'));

  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');

  process.on('SIGTERM', async () => await shutdown(app));
  process.on('SIGINT', async () => await shutdown(app));

  if (process.env.NODE_ENV !== 'production') {
    initializeSwaggerDocumentation(app, swaggerPath);
  }

  await app.listen({ port: +process.env.PORT, host: '0.0.0.0' });

  return app;
}

const shutdown = async (app: INestApplication) => {
  logger.log('Gracefull shutdown');
  try {
    {%- if consumer %}
    const amqpBrokerService = app.get(AmqpBrokerService);
    await amqpBrokerService.close();
    {%- endif %}
    await sleep(1 * 1000);
    await app.close();
    process.exit(0);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

bootstrap()
  .then(() => logger.log(`Server started on port = ${process.env.PORT}`))
  .catch(logger.log);
