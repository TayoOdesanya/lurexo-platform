import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
const allowedOrigins = new Set([
  "http://localhost:3000",
  "https://lurexo-web-fmb8g0cte0h5ame7.uksouth-01.azurewebsites.net",
]);

app.enableCors({
  origin: (origin, callback) => {
    // allow server-to-server / tools like Postman (no Origin header)
    if (!origin) return callback(null, true);

    // exact matches (local dev + your current site)
    if (allowedOrigins.has(origin)) return callback(null, true);

    // allow any Azure App Service hostname for your frontend (slots, re-deploys, etc.)
    if (/^https:\/\/.*\.azurewebsites\.net$/i.test(origin)) return callback(null, true);

    return callback(new Error(`CORS blocked for origin: ${origin}`), false);
  },
  credentials: true,
});

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Lurexo API running on port ${port}`);
}
bootstrap();
