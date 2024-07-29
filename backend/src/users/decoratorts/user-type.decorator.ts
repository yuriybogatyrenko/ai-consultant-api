import { SetMetadata } from '@nestjs/common';

export const Roles = (...user_type: string[]) =>
  SetMetadata('userType', user_type);
