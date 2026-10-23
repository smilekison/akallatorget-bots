import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

const target = process.env.TARGET_ENV || 'staging';
if (!['staging', 'production'].includes(target)) throw new Error('TARGET_ENV must be staging or production.');
const baseURL = target === 'production'
  ? process.env.PRODUCTION_BASE_URL
  : (process.env.STAGING_BASE_URL || 'https://akallatorget.smilekisan.com');
if (!baseURL) throw new Error('Set the target environment base URL.');
const parsed = new URL(baseURL);
if (!['https:', 'http:'].includes(parsed.protocol)) throw new Error('Base URL must be HTTP(S).');
const stagingHosts = new Set(['akallatorget.smilekisan.com', 'localhost', '127.0.0.1']);
if (target === 'staging' && !stagingHosts.has(parsed.hostname)) {
  throw new Error(`Refusing unexpected staging host "${parsed.hostname}". Add it to the explicit allowlist after verification.`);
}
if (target === 'production' && parsed.hostname === 'akallatorget.smilekisan.com') {
  throw new Error('Production URL points to the known staging host.');
}
if (target === 'production' && process.env.ENABLE_STAGING_MUTATIONS === 'true') {
  throw new Error('Mutation opt-in is forbidden in production.');
}
export default defineConfig({
  testDir: './tests', fullyParallel: false, forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0, workers: 1, timeout: 60000,
  expect: { timeout: 10000 },
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  outputDir: 'test-results', metadata: { targetEnvironment: target, observationMode: 'browser-only' },
  use: { baseURL, ...devices['Desktop Chrome'], headless: true, actionTimeout: 12000, navigationTimeout: 25000,
    trace: 'retain-on-failure', screenshot: 'only-on-failure', video: 'retain-on-failure' },
});
