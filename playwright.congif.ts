import { defineConfig } from '@playwright/test';

export default defineConfig({
    use:{
        headless: true,
        screenshot: 'only-on-failure',
        video: 'on-first-retry',
        trace: 'on-first-retry',
    },
    //Generar reporte en HTML
    reporter:[['html']],
    projects:[
        //Proyecto para Google Chrome
        { name: 'chromium', use: { browserName: 'chromium' } },
    ]
})