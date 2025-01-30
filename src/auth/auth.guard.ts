import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable, throwError } from 'rxjs';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector
  ) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    // Check if route is mark as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true; // Allow access to public routes
    }
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
      const payload = this.jwtService.verifyAsync(token);
      request['user'] = payload
    } catch (error) {
      throw new UnauthorizedException("Token is not valid");
    }
    return true;
  }
}
