import {defineConfig} from '@playwright/test';
export default defineConfig({
  testDir: './qa', fullyParallel: false, workers: 1, retries: 0,
  timeout: 30000, reporter: [['list'], ['json', {outputFile:'test-results/acceptance.json'}]],
  use: {baseURL: process.env.BASE_URL || 'http://localhost:5173', browserName:'chromium',viewport:{width:1280,height:900}, locale:'zh-TW', reducedMotion:'reduce',trace:'retain-on-failure'},
  webServer: process.env.BASE_URL ? undefined : {command:'npm run dev -- --port 5173 --strictPort',url:'http://localhost:5173',reuseExistingServer:!process.env.CI},
});
