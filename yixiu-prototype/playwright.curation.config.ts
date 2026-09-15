import { defineConfig } from '@playwright/test';

const origin = process.env.YIXIU_CURATION_ORIGIN;
export default defineConfig({
  testDir: './tests',
  testMatch: ['retired-music.spec.ts', 'free-music.spec.ts', 'ambient-music.spec.ts'],
  timeout: 30_000,
  use: { baseURL: origin ?? 'http://127.0.0.1:4203', viewport: { width: 390, height: 844 } },
  webServer: origin ? undefined : {
    command: 'python3 -m http.server 4203 --bind 127.0.0.1 --directory dist/client',
    url: 'http://127.0.0.1:4203/',
    reuseExistingServer: false,
  },
});
