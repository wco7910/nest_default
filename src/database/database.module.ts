import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '#/apis/account/entity/e.account'; 
import { AccountRepository } from '#/apis/account/repository/r.account';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
        useFactory: async () => {
            return {
              type: 'postgres',
              host: process.env.DB_HOST,
              port: Number(process.env.DB_PORT || 5432),
              database: process.env.DB_NAME,
              username: process.env.DB_USER,
              password: process.env.DB_PASSWORD,
              synchronize: false,
              logging: false,
              entities: [Account], 
              migrations: [],
              subscribers: [],
            };
        }
    }),
    TypeOrmModule.forFeature([AccountRepository]), 
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}