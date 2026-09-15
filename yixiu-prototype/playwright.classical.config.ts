import { defineConfig } from '@playwright/test';
const baseURL = process.env.YIXIU_TEST_URL || 'http://127.0.0.1:4208';
export default defineConfig({
  testDir: './tests',
  testMatch: /(?:access-revision|free-music|classical-music|ambient-music|retired-music|quiet-journal)\.spec\.ts/,
  timeout: 30_000,
  workers: 2,
  use: { baseURL, viewport: { width: 390, height: 844 }, channel: 'chrome' },
  webServer: process.env.YIXIU_TEST_URL ? undefined : {
    command: 'npx vite preview --host 127.0.0.1 --port 4208 --outDir dist/client',
    url: baseURL, reuseExistingServer: false,
  },
});
