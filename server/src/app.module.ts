import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import databaseConfig from './config/database.config';
import {
  Song,
  SongContributor,
  SongPhrase,
  SongWord,
  WordGroup,
  Artist,
} from './imports/entities';
import { TerminusModule } from '@nestjs/terminus';
import { HealthModule } from './health/health.module';
import { SongModule } from './modules/song/song.module';
import { ArtistModule } from './modules/artist/artist.module';
import { SongWordModule } from './modules/songWord/songWord.module';
import { WordGroupModule } from './modules/wordGroup/wordGroup.module';
import { SongContributorModule } from './modules/songContributor/songContributor.module';
import { DataSource } from 'typeorm';
import { SongPhraseModule } from './modules/songPhrase/songPhrase.module';
import { StatisticsModule } from './modules/statistics/statistics.module';

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
      SongContributor,
      Artist,
      WordGroup,
      SongPhrase,
    ]),
    TypeOrmModule.forRoot(databaseConfig()),
    TerminusModule.forRoot({}),
    HealthModule,
    SongModule,
    ArtistModule,
    HealthModule,
    SongWordModule,
    WordGroupModule,
    SongContributorModule,
    SongModule,
    SongPhraseModule,
    StatisticsModule,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {
    // dataSource.dropDatabase().then(() => console.log('DB-DROP'));
  }
}
