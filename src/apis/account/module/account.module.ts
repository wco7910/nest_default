import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from '../service/s.account'; 
import { AccountRepository } from '../repository/r.account'; 
import { DatabaseModule } from '#/database/database.module';  
import { Account } from '../entity/e.account'; 
import { LoginController } from '../controller/login'; 
import { CompanyInfoController } from '../controller/companyinfo'; 
import { tokenController } from '../controller/token'; 

@Module({
  imports: [TypeOrmModule.forFeature([Account, AccountRepository]),
  JwtModule.register({
    secret: process.env.JWT_SECRET_KEY, 
    signOptions: { expiresIn: '1h' },
  })], 
  providers: [AccountService, AccountRepository],  
  controllers: [LoginController, CompanyInfoController, tokenController],  
})
export class AccountModule {}