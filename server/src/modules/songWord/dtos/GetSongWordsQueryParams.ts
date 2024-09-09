import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class GetSongWordsQueryParams {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'page must be a number' })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'pageSize must be a number' })
  pageSize?: number;

  @IsOptional()
  songs?: string | string[];

  @IsOptional()
  groups?: string | string[];

  @IsOptional()
  @Type(() => Number)
  line?: number;

  @IsOptional()
  @Type(() => Number)
  stanza?: number;

  @IsOptional()
  @Type(() => Number)
  row?: number;

  @IsOptional()
  @Type(() => Number)
  col?: number;
}
