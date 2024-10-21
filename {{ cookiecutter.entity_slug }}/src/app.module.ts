import { Module } from '@nestjs/common';
import { AppController } from './app/app.controller';
import { AmqpBrokerModule } from './modules/amqp-broker/amqp-broker.module';
import TypeOrmConfigService from './config/orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    AmqpBrokerModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
