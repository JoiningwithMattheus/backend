import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRED_ROLES_KEY } from './roles.decorator';

interface AuthPayloadWithRoles {
  'cognito:groups'?: string[];
  realm_access?: {
    roles?: string[];
  };
  resource_access?: Record<
    string,
    {
      roles?: string[];
    }
  >;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      REQUIRED_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles?.length) return true;

    const req = context
      .switchToHttp()
      .getRequest<{ user?: AuthPayloadWithRoles }>();
    const tokenRoles = this.getTokenRoles(req.user);
    const hasRequiredRole = requiredRoles.some((role) =>
      tokenRoles.has(role.toLowerCase()),
    );

    if (!hasRequiredRole) {
      throw new ForbiddenException(
        `Requires role: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }

  private getTokenRoles(user: AuthPayloadWithRoles | undefined): Set<string> {
    const roles = new Set<string>();

    for (const role of user?.['cognito:groups'] ?? []) {
      roles.add(role.toLowerCase());
    }

    for (const role of user?.realm_access?.roles ?? []) {
      roles.add(role.toLowerCase());
    }

    for (const clientAccess of Object.values(user?.resource_access ?? {})) {
      for (const role of clientAccess.roles ?? []) {
        roles.add(role.toLowerCase());
      }
    }

    return roles;
  }
}
