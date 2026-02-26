import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
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
  // TODO: analise the best approach to use this filter
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = DOMAIN_EXCEPTION_STATUS_MAP.get(
      exception.constructor as ErrorConstructor,
    );

    if (status === undefined) {
      if (exception instanceof HttpException) {
        const exceptionResponse = exception.getResponse();
        const statusCode = exception.getStatus();

        if (typeof exceptionResponse === 'string') {
          response.status(statusCode).json({
            statusCode,
            message: exceptionResponse,
            error: exception.name,
          });
          return;
        }

        response.status(statusCode).json(exceptionResponse);
        return;
      }

      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        error: 'InternalServerError',
      });
      return;
    }

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: exception.name,
    });
  }
}
