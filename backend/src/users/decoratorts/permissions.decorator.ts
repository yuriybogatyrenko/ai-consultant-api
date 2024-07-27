import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../guards/permission.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

export const Permissions = (...permissions: string[]) => {
  return applyDecorators(
    SetMetadata('permissions', permissions),
    UseGuards(JwtAuthGuard, PermissionsGuard),
  );
};
