import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { ErrorCode } from '../exceptions/custom-exceptions';

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const ctx = gqlHost.getContext<{ req: Request }>();

    console.error(`[GraphQLException] ${exception.message}`, exception.stack);

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      const message =
        typeof response === 'object' && response !== null
          ? (response as { message?: string | string[] })?.message ||
            'Unknown error'
          : String(response);

      let code = ErrorCode.INTERNAL_SERVER_ERROR;

      switch (status) {
        case 400:
          code = ErrorCode.VALIDATION_ERROR;
          break;
        case 401:
          code = ErrorCode.UNAUTHORIZED;
          break;
        case 403:
          code = ErrorCode.FORBIDDEN;
          break;
        case 404:
          code = ErrorCode.NOT_FOUND;
          break;
        case 409:
          code = ErrorCode.ALREADY_EXISTS;
          break;
        default:
          code = ErrorCode.INTERNAL_SERVER_ERROR;
      }

      return new GraphQLError(
        Array.isArray(message) ? message.join(', ') : message.toString(),
        {
          extensions: {
            code,
            timestamp: new Date().toISOString(),

            path: ctx?.req?.url || '',
            exception: {
              name: exception.name,
              status,
            },
          },
        },
      );
    }

    if (exception instanceof GraphQLError) {
      // GraphQL-specific errors
      return exception;
    }

    // Generic errors
    return new GraphQLError(exception.message || 'Internal server error', {
      extensions: {
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
        exception: {
          name: exception.name,
        },
      },
    });
  }
}
