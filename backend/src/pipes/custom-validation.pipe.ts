import {
  Injectable,
  ValidationPipe,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Validation failed',
          errors: this.buildErrorMessages(validationErrors),
        });
      },
    });
  }

  private buildErrorMessages(validationErrors: ValidationError[]) {
    return validationErrors.map((error) => {
      return {
        property: error.property,
        constraints: error.constraints,
        children: error.children
          ? this.buildErrorMessages(error.children)
          : undefined,
      };
    });
  }
}
