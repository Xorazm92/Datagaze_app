import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
// import { HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

interface ExceptionResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as ExceptionResponse;

    const errorResponse = {
      status: 'error',
      timestamp: new Date().toISOString(),
      statusCode: status,
      error: HttpStatus[status],
      message: typeof exceptionResponse === 'string' 
        ? exceptionResponse 
        : Array.isArray(exceptionResponse.message)
          ? exceptionResponse.message[0]
          : exceptionResponse.message || exception.message,
    };

    // Add validation error details if available
    if (exceptionResponse?.message) {
      errorResponse.message = Array.isArray(exceptionResponse.message)
        ? exceptionResponse.message[0]
        : exceptionResponse.message;
    }

    response.status(status).json(errorResponse);
  }
}
