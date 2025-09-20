import { test, expect } from '@playwright/test';
import { chromium } from 'playwright';


test('Agregar productos de la categoría Amor al carrito', async ({  }) => {

    const browser = await chromium.launch({ headless: false, slowMo: 100 });
const context = await browser.newContext();
const page = await context.newPage();

await page.goto('https://www.floristeriamundoflor.com/');
await page.locator('#menu-item-2806 a').click(); // Ir a categoría Amor

await page.getByRole('button', { name: 'Filtrar' }).click();

const producto1 = page.locator('.product-block[data-product-id="4100"]');
await producto1.hover();
await producto1.locator('a.add_to_cart_button').click();

await expect(page.getByText(/MDF 0001.*se ha añadido a tu carrito/i)).toBeVisible();

await page.getByRole('link', { name: 'Seguir comprando' }).click();

const producto2 = page.locator('.product-block[data-product-id="4096"]');
await producto2.hover();
await producto2.locator('a.add_to_cart_button').click();
await expect(page.getByText(/MDF 0003.*se ha añadido a tu carrito/i)).toBeVisible();


}

);

