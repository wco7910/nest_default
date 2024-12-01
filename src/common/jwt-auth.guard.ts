import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context) {
    const request = context.switchToHttp().getRequest();

    if (request.url === '/account/signin' || request.url === '/account/signup') {
      return true;
    }

    return super.canActivate(context); 
  }
}
