import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: { brokers: ['localhost:9092'] },
      consumer: { groupId: 'solana-consumer' },
    },
  });

  const config = new DocumentBuilder()
    .setTitle('Pet-mall example')
    .setDescription('The pet-mall API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurity('CRM', {
      type: 'http',
      scheme: 'bearer',
    })
    .addSecurity('CRM Admin', {
      type: 'http',
      scheme: 'bearer',
    })
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);

  SwaggerModule.setup('api/docs', app, document);

  await app.listen(5000);
  try {
    await app.startAllMicroservices();
  } catch (error) {
    console.log('Kafka failed: ' + error.message);
  }
}
bootstrap();
