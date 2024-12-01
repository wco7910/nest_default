import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY, // .env 파일에서 JWT_SECRET_KEY 값 가져오기
    });
  }

  async validate(payload: any) {
    // payload에서 사용자 정보를 반환
    return { userId: payload.sub, username: payload.username };
  }
}
