import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from '#/apis/account/service/s.account';

@Injectable()
export class Middleware implements NestMiddleware {
  constructor(private jwtService: JwtService,
    private accountService: AccountService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    console.log("middleware")
    const accessToken = req.headers['authorization']?.split('Bearer ')[1]; 

    if (!accessToken) {
      return next(); 
    }

    try {
        const decoded = await this.jwtService.verify(accessToken, {
            secret: process.env.JWT_SECRET_KEY,
        });

        req['user'] = decoded;
        return next();
    } catch (err) {
        // console.log(err)

        const decoded = await this.jwtService.decode(accessToken);

        const result = await this.accountService.refreshAccessToken(
            decoded.id 
        );

        return res.status(HttpStatus.OK).json({
            message: 'Access token has been refreshed successfully',
            payload: {
                access_token: 'aaa'
            },
        });

      // 액세스 토큰이 만료되었거나 유효하지 않으면, 리프레시 토큰으로 새로운 액세스 토큰 발급
    //   if (refreshToken) {
    //     try {
    //       // 리프레시 토큰을 검증하여 새로운 액세스 토큰 발급
    //       const decodedRefreshToken = await this.jwtService.verifyAsync(refreshToken, {
    //         secret: process.env.JWT_SECRET_KEY,
    //       });

    //       // 새로운 액세스 토큰 생성
    //       const newAccessToken = await this.jwtService.signAsync(
    //         {
    //           id: decodedRefreshToken.id,
    //           username: decodedRefreshToken.username,
    //           role: decodedRefreshToken.role,
    //         },
    //         {
    //           secret: process.env.JWT_SECRET_KEY,
    //           expiresIn: '1h', // 새로운 액세스 토큰 유효 기간
    //         },
    //       );

    //       // 새로운 액세스 토큰을 바로 응답으로 보냄
    //       return res.status(HttpStatus.OK).json({
    //         message: 'Access token has been refreshed successfully',
    //         payload: {
    //           access_token: newAccessToken,
    //         },
    //       });
    //     } catch (error) {
    //       throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    //     }
    //   }

      // 리프레시 토큰이 없거나 유효하지 않으면 401 에러 반환
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
