import { Controller, Post, Get, Query, Body, Res, HttpStatus, HttpException } from '@nestjs/common';
import { AccountService } from '../service/s.account';
import { Response } from 'express';

@Controller('account')
export class CompanyInfoController {
  constructor(private readonly accountService: AccountService) {}

  @Get('companyinfo')
  async login(@Query() query: any, @Res() res: Response) { 
    try {
        const result = await this.accountService.companyInfo();

        return res.json({
          companyInfo: result,
        });
      } catch (err) {
        console.log(err);
        return res.json({
          version: process.env?.API_VERSION,
          message: 'Error',
          code: 403,
          error: {
            code: 403,
            message: '오류가 발생했습니다.',
          },
        });
      }
  }
}