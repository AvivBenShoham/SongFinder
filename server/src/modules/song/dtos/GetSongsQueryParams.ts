import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class GetSongsQueryParams {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'page must be a number' })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'pageSize must be a number' })
  pageSize?: number;

  @IsOptional()
  words?: string | string[];

  @IsOptional()
  albums?: string | string[];

  @IsOptional()
  artists?: string | string[];

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  songName?: string;
}
