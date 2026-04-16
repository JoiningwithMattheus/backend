import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly issuer: string;
  private readonly jwks: ReturnType<typeof createRemoteJWKSet>;

  constructor(configService: ConfigService) {
    this.issuer =
      configService.get<string>('AUTH_ISSUER') ??
      'https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_906kvnKmh';

    const jwksUri =
      configService.get<string>('AUTH_JWKS_URI') ??
      `${this.issuer}/.well-known/jwks.json`;

    this.jwks = createRemoteJWKSet(new URL(jwksUri));
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const header = req.headers?.authorization;

    if (typeof header !== 'string' || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing Bearer token');
    }

    const token = header.slice('Bearer '.length).trim();

    try {
      const { payload } = await jwtVerify(token, this.jwks, {
        issuer: this.issuer,
      });

      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
