import { NestFactory } from '@nestjs/core';
import { LogLevel, RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

const DEFAULT_LOCAL_ORIGINS = ['http://localhost:3000'];

function parseLogLevels(input?: string): LogLevel[] | undefined {
  if (!input) return undefined;

  const allowed = new Set<LogLevel>(['log', 'error', 'warn', 'debug', 'verbose', 'fatal']);
  const levels = input
    .split(',')
    .map((level) => level.trim())
    .filter((level) => allowed.has(level as LogLevel)) as LogLevel[];

  return levels.length ? levels : undefined;
}

function buildAllowedOrigins(config: ConfigService): Set<string> {
  const origins = new Set(DEFAULT_LOCAL_ORIGINS);

  const frontendUrl = config.get<string>('FRONTEND_URL');
  if (frontendUrl) origins.add(frontendUrl);

  const extraOrigins = config.get<string>('CORS_ALLOWED_ORIGINS');
  if (extraOrigins) {
    extraOrigins
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)
      .forEach((origin) => origins.add(origin));
  }

  return origins;
}

async function bootstrap() {
  const logLevels = parseLogLevels(process.env.LOG_LEVELS);
  const app = await NestFactory.create(AppModule, logLevels ? { logger: logLevels } : undefined);
  const config = app.get(ConfigService);

  // Enable CORS
  const allowedOrigins = buildAllowedOrigins(config);
  app.enableCors({
    origin: (origin, callback) => {
      // allow server-to-server / tools like Postman (no Origin header)
      if (!origin) return callback(null, true);

      // exact matches (local dev + configured sites)
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
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  const port = Number(config.get<string>('PORT') || 3001);
  await app.listen(port, '0.0.0.0');
  console.log(`Lurexo API running on port ${port}`);
}
bootstrap();
