import { DataSource } from 'typeorm';
import { Song } from './song.entity';

export const songProvider = [
  {
    provide: 'SONG_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Song),
    inject: ['DATA_SOURCE'],
  },
];