import {
  HttpException,
  HttpStatus,
  ValidationError,
  ValidationPipe,
} from "@nestjs/common";

export class Validate extends ValidationPipe {
  protected flattenValidationErrors(
    validationErrors: ValidationError[],
  ): string[] {
    const message = {};
    validationErrors.forEach(error => {
      message[error.property] = Object.values(error.constraints).join(", ");
    });
    throw new HttpException(
      {
        code: 422,
        message,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
