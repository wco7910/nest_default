import { Controller, Post, Body, Res, HttpStatus, HttpException, UseGuards  } from '@nestjs/common';
import { AccountService } from '../service/s.account';
import { Response } from 'express';

@Controller('account')
export class LoginController {
  constructor(private readonly accountService: AccountService) {}

  @Post('signin')
  async login(@Body() body: any, @Res() res: Response) { 
    try {
      const { email, password, firebaseToken, ipAddress } = body;  

      const result = await this.accountService.logIn(
        email,         
        password,     
        firebaseToken,    
      );

      return res.status(HttpStatus.OK).json({
        version: process.env?.API_VERSION,
        message: 'OK',
        payload: {
          access_token: result[0],
          refresh_token: result[1],
          expired_at: result[2],
          accountId: result[3],
          type: 'Bearer',
        },
      });
    } catch (err) {
      console.error(err);

      if (err.message === 'Unauthorized user') {
        return res.status(HttpStatus.OK).json({
          version: process.env?.API_VERSION,
          message: 'SUSPENDED_ACCOUNT',
          code: 403,
          error: {
            code: 403,
            message: '활동이 정지된 계정입니다.',
          },
        });
      }

      return res.status(HttpStatus.OK).json({
        version: process.env?.API_VERSION,
        message: 'USER_NOT_FOUND',
        code: 404,
        error: {
          code: 404,
          message: '로그인에 실패했습니다.',
        },
      });
    }
  }
}