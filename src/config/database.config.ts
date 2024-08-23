import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Artist } from "src/modules/artist/artist.entity";
import { Song } from "src/modules/song/song.entity";
import { SongContributor } from "src/modules/songContributer/songContributer.entity";
import { SongPhrase } from "src/modules/songPhrase/songPhrase.entity";
import { SongWord } from "src/modules/songWord/songWord.entity";
import { WordGroup } from "src/modules/wordGroup/wordGroup.entity";
import 'dotenv/config';

export default () => ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    username: process.env.DB_USERNAME || 'songfinder',
    password: process.env.DB_USERNAME || 'amitandaviv',
    database: process.env.DB_NAME || 'song_finder',
    entities: [Song, SongWord, SongContributor, Artist, WordGroup, SongPhrase],
    synchronize: true
} as TypeOrmModuleOptions);
