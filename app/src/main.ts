import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita CORS
  app.enableCors({
    origin: 'http://localhost:3000', // Adicione aqui a URL do seu frontend
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  await app.listen(3001);
  app.useLogger(console);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
