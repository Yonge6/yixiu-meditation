import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "quiet-journal.spec.ts",
  timeout: 20_000,
  use: { baseURL: "http://127.0.0.1:4194", viewport: { width: 390, height: 844 } },
  webServer: {
    command: "python3 -m http.server 4194 --bind 127.0.0.1 --directory dist/client",
    url: "http://127.0.0.1:4194/",
    reuseExistingServer: false,
  },
});
