import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

// Define a proper user type
export interface User {
  id: number;
  username: string;
  password: string;
  validatePassword(password: string): Promise<boolean>;
}

export interface RequestWithUser {
  req: {
    user: {
      id: number;
      username: string;
      password: string;
      validatePassword(password: string): Promise<boolean>;
    };
  };
}

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext<RequestWithUser>().req.user;
  },
);
