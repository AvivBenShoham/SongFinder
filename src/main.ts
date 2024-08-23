import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

// require('dotenv').config({ path: './config/.env' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('Songs Finder')
  .setDescription('The songs finder API description')
  .setVersion('1.0')
  .addTag('songs')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);


  console.log('Start to listen in port: ', app.get<ConfigService>(ConfigService).get('port'))
  await app.listen(app.get<ConfigService>(ConfigService).get('port'));
}

bootstrap();
