import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    timeout: 60 * 1000,
    retries: 0,
    use:{
        headless: false,
        screenshot: 'only-on-failure',
        video: 'on-first-retry',
        trace: 'on-first-retry',
    },
        //Generar reporte en HTML
    reporter: [
        ['list'],
        ['html', { open: 'never' }]
    ],
    projects:[
        //Proyecto para Google Chrome
        { name: 'chromium', use: { browserName: 'chromium' } },
    ]
})