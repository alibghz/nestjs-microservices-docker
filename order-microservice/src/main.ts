import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/common/enums/transport.enum';
import { order_host } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      retryAttempts: 5,
      retryDelay: 3000,
      host: order_host,
      port: 8876,
    },
  });

  await app.startAllMicroservicesAsync();
  app.setGlobalPrefix('api');
  app.enableCors();
  const options = new DocumentBuilder()
    .setTitle('Orders Service')
    .setDescription('Manages orders')
    .setVersion('1.0')
    .addTag('orders')
    .setBasePath('/api')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document);

  await app.listen(8877);
}
bootstrap();
