import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { UserNotFoundException } from '../../users/domain/exceptions/user-not-found.exception';

type ErrorConstructor = new (...args: never[]) => Error;

const DOMAIN_EXCEPTION_STATUS_MAP = new Map<ErrorConstructor, HttpStatus>([
  [UserNotFoundException, HttpStatus.NOT_FOUND],
]);

@Catch(Error)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = DOMAIN_EXCEPTION_STATUS_MAP.get(
      exception.constructor as ErrorConstructor,
    );

    if (status === undefined) {
      throw exception;
    }

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: exception.name,
    });
  }
}
