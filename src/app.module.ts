import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import databaseConfig from './config/database.config';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from "src/modules/song/song.entity";
import { SongContributor } from "src/modules/songContributer/songContributer.entity";
import { SongPhrase } from "src/modules/songPhrase/songPhrase.entity";
import { SongWord } from "src/modules/songWord/songWord.entity";
import { WordGroup } from "src/modules/wordGroup/wordGroup.entity";
import { Artist } from "src/modules/artist/artist.entity";
import { SongController } from './modules/song/song.controller';
import { SongService } from './modules/song/song.service';

//TODO: .env not getting imported

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './config/.env', load: [configuration]}), 
    TypeOrmModule.forFeature([Song, SongWord, SongContributor, Artist, WordGroup, SongPhrase]),
    TypeOrmModule.forRoot(databaseConfig())
],
  controllers: [SongController, AppService],
  providers: [SongService, AppService],
})
export class AppModule {}
