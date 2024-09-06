import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class PositiveNumberPipe implements PipeTransform {
  transform(value: string): number {
    const num = parseInt(value, 10);
    if (isNaN(num) || num <= 0) {
      throw new BadRequestException('The parameter must be a positive number');
    }
    return num;
  }
}
