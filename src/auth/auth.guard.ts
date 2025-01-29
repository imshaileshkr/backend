import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from 'constant';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService
  ) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Getting Header
    const request: Request = context.switchToHttp().getRequest();

    const access_token = request.headers['authorization'] || request.headers['Authorization'];

    if (!access_token || access_token.split(' ')[0] !== 'Bearer') {
      throw new UnauthorizedException("Please Login");
    }
    const token = access_token.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException("Token is not valid");
    }
    try {
      const payload = this.jwtService.verifyAsync(token, { secret: JWT_SECRET });
      request['user'] = payload
    } catch (error) {
      throw new UnauthorizedException("Token is not valid");
    }
    return true;
  }
}
