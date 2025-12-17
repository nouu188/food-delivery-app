import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@backend/shared';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
