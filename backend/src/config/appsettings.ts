import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

type AppSettings = Record<string, unknown>;

function readJson(filePath: string): AppSettings {
  if (!existsSync(filePath)) {
    return {};
  }

  try {
    return JSON.parse(readFileSync(filePath, 'utf8')) as AppSettings;
  } catch {
    return {};
  }
}

function filterMissingEnv(settings: AppSettings): AppSettings {
  const filtered: AppSettings = {};
  for (const [key, value] of Object.entries(settings)) {
    if (process.env[key] !== undefined) continue;
    if (value === null || value === undefined) continue;
    filtered[key] = value;
  }
  return filtered;
}

export function appSettingsConfig(): AppSettings {
  const rootDir = join(__dirname, '..', '..');
  const baseSettings = readJson(join(rootDir, 'appsettings.json'));

  const envName = process.env.APPSETTINGS_ENV || process.env.NODE_ENV;
  const envSuffix = envName?.toLowerCase() === 'production' ? 'Production' : envName;
  const envSettings = envSuffix
    ? readJson(join(rootDir, `appsettings.${envSuffix}.json`))
    : {};

  return filterMissingEnv({
    ...baseSettings,
    ...envSettings,
  });
}
