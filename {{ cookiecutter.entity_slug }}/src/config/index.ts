import dotenv from 'dotenv';

dotenv.config({
  path: '.env',
  debug: process.env.DEBUG === 'true' ? true : false,
});

const { AMQP_HOST, AMQP_PORT, RABBIT_PASSWORD } = process.env;

export default {
  amqpHost: AMQP_HOST || 'localhost',
  amqpPort: AMQP_PORT || '5672',
  amqpUser: 'guest',
  amqpPassword: RABBIT_PASSWORD || 'guest',
};
