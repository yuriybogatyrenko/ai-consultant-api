import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const userType = this.reflector.get<string[]>(
      'userType',
      context.getHandler(),
    );
    if (!userType) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return userType === user.role;
  }
}
