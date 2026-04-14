import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { config } from 'dotenv';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { resolve } from 'node:path';

config({ path: resolve(process.cwd(), '../.env') });

const issuer = process.env.KEYCLOAK_ISSUER ?? 'http://localhost:8080/realms/NestJS';
const jwks = createRemoteJWKSet(new URL(`${issuer}/protocol/openid-connect/certs`));

@Injectable()
export class KeycloakJwtGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const header = req.headers?.authorization;

    if (typeof header !== 'string' || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing Bearer token');
    }

    const token = header.slice('Bearer '.length).trim();

    try {
      const { payload } = await jwtVerify(token, jwks, { issuer });
      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
