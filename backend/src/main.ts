import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './pipes/custom-validation.pipe';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();

  app.useGlobalPipes(new CustomValidationPipe());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('PORT') || 3000);

  console.log(`Application is running on: ${await app.getUrl()}/api`);
}
bootstrap();
