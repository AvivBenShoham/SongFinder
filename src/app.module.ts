import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import databaseConfig from './config/database.config';
import {
  Song,
  SongContributer,
  SongPhrase,
  SongWord,
  WordGroup,
  Artist,
} from './imports/entities';
import { SongController } from './modules/song/song.controller';
import { ArtistController } from './modules/artist/artist.controller';
import { AppController } from './app.controller';
import { ArtistService } from './modules/artist/artist.service';
import { AppService } from './app.service';
import { SongService } from './modules/song/song.service';
import { HealthController } from './health/health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HealthModule } from './health/health.module';
import { SongWordController } from './modules/songWord/songWord.controller';
import { SongWordService } from './modules/songWord/songWord.service';
import { SongContributerService } from './modules/songContributer/songContributer.service';

//TODO: .env not getting imported

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './config/.env',
      load: [configuration],
    }),
    TypeOrmModule.forFeature([
      Song,
      SongWord,
      SongContributer,
      Artist,
      WordGroup,
      SongPhrase,
    ]),
    TypeOrmModule.forRoot(databaseConfig()),
    TerminusModule.forRoot({}),
    HealthModule,
  ],
  controllers: [
    SongController,
    AppController,
    ArtistController,
    HealthController,
    SongWordController,
  ],
  providers: [
    SongService,
    AppService,
    ArtistService,
    SongWordService,
    SongContributerService,
  ],
})
export class AppModule {}
