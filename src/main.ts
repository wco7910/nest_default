import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './common/jwt-auth.guard';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); 
  app.useGlobalGuards(new JwtAuthGuard(new Reflector()));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
