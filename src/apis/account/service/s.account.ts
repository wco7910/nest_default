import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountRepository } from '../repository/r.account';
import { randomBytes, scrypt as _scrpyt } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';

const scrypt = promisify(_scrpyt);

@Injectable()
export class AccountService {
    constructor(
        private accountRepository: AccountRepository,  
        private jwtService: JwtService, 
      ) {}

    async logIn (
        email: string,
        password: string,
        firebaseToken: string,
    )  {
        console.log(`"${email}"`);
        const user = await this.accountRepository
        .createQueryBuilder('account')
        .where('account.email =:email', { email: email })
        .addSelect('account.password')
        .getOne();

        if (!user) {
        throw new Error('user not found!');
        }
        // if ((await AccountService.suspendCheck(user.id)) == false) {
        // throw new Error('unauthorized user');
        // }

        const [salt, storedhash] = user.password.split('.');

        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if (storedhash !== hash.toString('hex')) {
            console.log("비밀번호 불일치");
            throw new Error('bad password');
        } else {
            console.log("비밀번호 일치");
        }

        const [access_token, refresh_token, expired_at] = await this.jwtAssign(user);

        await this.accountRepository.update(user.id, {
            firebaseToken: firebaseToken,
            refreshToken: refresh_token,
        });

        return [access_token, refresh_token, expired_at, user.id];
    }

    async companyInfo (

    )  {
        const info = await this.accountRepository.findOne({
            where: {
              role: 'admin',
            }
          });

        return info;
    }

    async jwtAssign (account) {
        const expired_at = Math.floor((Date.now() + parseInt('600') * 1000) / 1000);
        const payload = {
            id: account.id,
            username: account.name,
            role: account.role,
            center: account?.centerId,
            centerName: account?.center?.name,
            };

            const access_token = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET_KEY,
            expiresIn: '1m',
            });
        
            const refresh_token = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET_KEY,
            expiresIn: '30d',
            });
        
            return [access_token, refresh_token, String(expired_at)];
    }

    async refreshAccessToken (
        id: String
    )  {
        console.log('ddd')

        return 'aaa';
    }
}