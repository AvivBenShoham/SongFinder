import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

// require('dotenv').config({ path: './config/.env' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('Start to listen in port: ', app.get<ConfigService>(ConfigService).get('port'))
  await app.listen(app.get<ConfigService>(ConfigService).get('port'));
}

bootstrap();
