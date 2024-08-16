import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './pipes/custom-validation.pipe';
import { useContainer } from 'class-validator';
import { readFileSync } from 'fs';
import { join } from 'path';

async function bootstrap() {
  const httpsOptions = {
    key: readFileSync(join(__dirname, '../../ssl/localhost-key.pem')),
    cert: readFileSync(join(__dirname, '../../ssl/localhost.pem')),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.setGlobalPrefix('api');
  app.enableCors();

  app.useGlobalPipes(new CustomValidationPipe());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('PORT') || 3000);

  console.log(`Application is running on: ${await app.getUrl()}/api`);
}
bootstrap();
