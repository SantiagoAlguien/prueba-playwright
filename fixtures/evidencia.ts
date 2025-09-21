import { test } from '@playwright/test';

export async function evidencia(page: { screenshot: (arg0: { path: string; fullPage: boolean; }) => any; }, nombre: string) {
  const fileName = `test-results/${nombre.replace(/\s+/g, '_')}.png`;
  await page.screenshot({ path: fileName, fullPage: true });
  test.info().attach(nombre, { path: fileName, contentType: 'image/png' });
}