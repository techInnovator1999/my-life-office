import { SetMetadata } from '@nestjs/common';

// export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

export const Roles = (roleOrRoles?: string | string[]) => {
  let authorizedRoles: string[] = [];
  if (roleOrRoles)
    authorizedRoles = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];
  return SetMetadata('roles', authorizedRoles);
};
