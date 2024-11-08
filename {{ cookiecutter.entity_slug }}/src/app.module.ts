{%- set components = cookiecutter.components.split(',') -%}
{%- set db = "db" in components -%}
{%- set consumer = "consumer" in components -%}
{%- set jwt = "jwt" in components -%}
{%- set mailer = "mailer" in components -%}
{%- set storage = "storage" in components -%}
import { Module } from '@nestjs/common';
import { AppController } from './app/app.controller';
import { ConfigModule } from '@nestjs/config';
{%- if consumer %}
import { AmqpBrokerModule } from './modules/amqp-broker/amqp-broker.module';
{%- endif %}

{%- if jwt %}
import { JwtModule } from '@nestjs/jwt';
{%- endif %}

{%- if mailer %}
import { MailerModule } from '@nestjs-modules/mailer';
import SmtpConfigService from './config/mailer.config';
{%- endif %}

{%- if storage %}
import { StorageModule } from './modules/storage/storage.module';
{%- endif %}

{%- if db %}
import { TypeOrmModule } from '@nestjs/typeorm';
import TypeOrmConfigService from './config/db/orm.config';
{%- endif %}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    {%- if consumer %}
    AmqpBrokerModule,
    {%- endif %}
    
    {%- if db %}
    TypeOrmModule.forFeature([]),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    {%- endif %}
    
    {%- if mailer %}
    MailerModule.forRootAsync({
      useClass: SmtpConfigService,
    }),
    {%- endif %}
    {%- if jwt %}
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '8h' },
    }),
    {%- endif %}
    
    {%- if storage %}
    StorageModule,
    {%- endif %}
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
