import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    console.log(request);
    const userId = request.user?.userId; // Assuming you have user information attached to the request
    console.log('permissions user: ', request.user);
    if (!userId) {
      return false;
    }

    for (const permission of requiredPermissions) {
      if (await this.authService.userHasPermission(userId, permission)) {
        return true;
      }
    }

    return false;
  }
}
