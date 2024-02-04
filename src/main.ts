import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  //app.useLogger(['error', 'warn', 'log']]);
  const config = new DocumentBuilder()
    .setTitle('The Pool API')
    .setDescription('The Pool API documentation')
    .setTermsOfService('https://jointhepool.com/Terms-of-use-The-pool.pdf')
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
