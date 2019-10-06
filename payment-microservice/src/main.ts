import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/common/enums/transport.enum';
import { Logger } from '@nestjs/common';
import { payment_host } from './config';

const logger = new Logger('Main');

const microserviceOptions = {
  transport: Transport.TCP,
  options: {
    host: payment_host,
    port: 8875,
  },
};

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, microserviceOptions);
  app.listen(() => {
    logger.log('Payment microservice is listening...');
  });
}
bootstrap();
