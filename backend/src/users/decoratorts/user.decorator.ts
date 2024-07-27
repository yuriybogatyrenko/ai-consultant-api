import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (variableName: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (variableName) {
      return user ? user[variableName] : undefined;
    } else {
      return user;
    }
  },
);
