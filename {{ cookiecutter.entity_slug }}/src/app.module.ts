import { Module } from '@nestjs/common';
import { AppController } from './app/app.controller';
import { AmqpBrokerModule } from './modules/amqp-broker/amqp-broker.module';
{%- if cookiecutter.use_db == 'y' %}
import TypeOrmConfigService from './config/orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
{%- else -%}
//
{%- endif %}

@Module({
  imports: [
    AmqpBrokerModule,
    {%- if cookiecutter.use_db == 'y' %}
      TypeOrmModule.forRootAsync({
        useClass: TypeOrmConfigService,
      }),
      {%- else -%}
      //
      {%- endif %}
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
