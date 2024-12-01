import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AccountModule } from '#/apis/account/module/account.module';
import { JwtStrategy } from './common/jwt.strategy';
import { JwtAuthGuard } from './common/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { Middleware } from '#/middleware/index';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY, 
      signOptions: { expiresIn: '1m' },  
    }),
    ConfigModule.forRoot({
      isGlobal: true,  
      envFilePath: '.env',
    }),
    DatabaseModule,  
    AccountModule,  
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    JwtStrategy, 
    {
      provide: APP_GUARD, 
      useClass: JwtAuthGuard,
    },
  ],
})

// export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(Middleware)  
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}