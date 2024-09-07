import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Songs Finder')
    .setDescription('The songs finder API description')
    .setVersion('1.0')
    .addTag('songs')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors();

  await app.listen(app.get<ConfigService>(ConfigService).get('port'), () => {
    Logger.log(
      `Start to listen in port: ${app.get<ConfigService>(ConfigService).get('port')}`,
    );
  });
}

bootstrap();
