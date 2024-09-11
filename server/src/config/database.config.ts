import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  Song,
  SongContributer,
  SongPhrase,
  SongWord,
  WordGroup,
  Artist,
} from 'src/imports/entities';
import 'dotenv/config';

export default () =>
  ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    username: process.env.DB_USERNAME || 'admin',
    password: process.env.DB_USERNAME || 'admin',
    database: process.env.DB_NAME || 'song_finder',
    entities: [Song, SongWord, SongContributer, Artist, WordGroup, SongPhrase],
    synchronize: true,
  }) as TypeOrmModuleOptions;
