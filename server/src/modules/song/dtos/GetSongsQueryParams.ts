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
  @IsString()
  words?: string | string[];

  @IsOptional()
  @IsString()
  albums?: string | string[];

  @IsOptional()
  @IsString()
  artists?: string | string[];

  @IsOptional()
  @IsString()
  date?: string;
}
