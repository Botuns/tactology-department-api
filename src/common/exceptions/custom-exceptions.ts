import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { GraphQLError } from 'graphql';

export enum ErrorCode {
  // Authentication errors
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',

  // Resource errors
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',

  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',

  // Server errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
}

export class GraphQLErrorFilter extends GraphQLError {
  constructor(
    message: string,
    code: ErrorCode,
    additionalInfo?: Record<string, any>,
  ) {
    super(message, {
      extensions: {
        code,
        ...additionalInfo,
      },
    });
  }
}

// Custom exceptions that extend NestJS exceptions but work with GraphQL
export class GraphQLBadRequestException extends BadRequestException {
  constructor(message: string, additionalInfo?: Record<string, any>) {
    super(
      new GraphQLErrorFilter(
        message,
        ErrorCode.VALIDATION_ERROR,
        additionalInfo,
      ),
    );
  }
}

export class GraphQLNotFoundException extends NotFoundException {
  constructor(message: string, additionalInfo?: Record<string, any>) {
    super(new GraphQLErrorFilter(message, ErrorCode.NOT_FOUND, additionalInfo));
  }
}

export class GraphQLUnauthorizedException extends UnauthorizedException {
  constructor(message: string, additionalInfo?: Record<string, any>) {
    super(
      new GraphQLErrorFilter(message, ErrorCode.UNAUTHORIZED, additionalInfo),
    );
  }
}

export class GraphQLForbiddenException extends ForbiddenException {
  constructor(message: string, additionalInfo?: Record<string, any>) {
    super(new GraphQLErrorFilter(message, ErrorCode.FORBIDDEN, additionalInfo));
  }
}

export class GraphQLConflictException extends ConflictException {
  constructor(message: string, additionalInfo?: Record<string, any>) {
    super(
      new GraphQLErrorFilter(message, ErrorCode.ALREADY_EXISTS, additionalInfo),
    );
  }
}

export class GraphQLInternalServerErrorException extends InternalServerErrorException {
  constructor(message: string, additionalInfo?: Record<string, any>) {
    super(
      new GraphQLErrorFilter(
        message,
        ErrorCode.INTERNAL_SERVER_ERROR,
        additionalInfo,
      ),
    );
  }
}
