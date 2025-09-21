import { test, expect } from '@playwright/test';
import { chromium } from 'playwright';

function parsePrecio(texto: string): number {
  // Limpia separadores de miles y convierte a número
  return Number(texto.replace(/[^\d]/g, ''));
}

test('Agregar productos de la categoría Amor al carrito', async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://www.floristeriamundoflor.com/');
  await page.locator('#menu-item-2806 a').click(); // Ir a categoría Amor

  await page.getByRole('button', { name: 'Filtrar' }).click();

  const producto1 = page.locator('.product-block[data-product-id="4100"]');

  // Guardar nombre y precio
  const nombre1 = await producto1.locator('.caption h3.name a').innerText();
  const precio1 = await producto1.locator('.caption .price').innerText();

  console.log('Producto:', nombre1);
  console.log('Precio:', precio1);
  
  const response1Promise = page.waitForResponse((resp) =>
    resp.url().includes('wc-ajax=add_to_cart') && resp.status() >= 200 && resp.status() < 300
  );


  // Interactuar con el producto
  await producto1.hover();
  await producto1.locator('a.add_to_cart_button').click();
  const response1 = await response1Promise;

  // Validar status
  expect(response1.status()).toBeGreaterThanOrEqual(200);
  expect(response1.status()).toBeLessThan(300);
  
  const postData1 = response1.request().postData() || '';
  expect(postData1).toContain('product_id=4100');

  console.log('Respuesta red producto1 OK:', response1.url(), postData1);

//  Validar que se agregó correctamente al carrito
  await expect(page.getByText(new RegExp(`${nombre1}.*se ha añadido a tu carrito`, 'i'))).toBeVisible();

  await page.getByRole('link', { name: 'Seguir comprando' }).click();

  const producto2 = page.locator('.product-block[data-product-id="4096"]');
  // Guardar nombre y precio
  const nombre2 = await producto2.locator('.caption h3.name a').innerText();
  const precio2 = await producto2.locator('.caption .price').innerText();

  console.log('Producto:', nombre2);
  console.log('Precio:', precio2);

  // ---- Interceptar llamada de red producto 2 ----
  const response2Promise = page.waitForResponse((resp) =>
    resp.url().includes('wc-ajax=add_to_cart') &&
    resp.status() >= 200 &&
    resp.status() < 300
  );

  await producto2.hover();
  await producto2.locator('a.add_to_cart_button').click();  
  const response2 = await response2Promise;

  // Validar status
  expect(response2.status()).toBeGreaterThanOrEqual(200);
  expect(response2.status()).toBeLessThan(300);
  
  const postData2 = response2.request().postData() || '';
  expect(postData2).toContain('product_id=4096');
  console.log('Respuesta red producto2 OK:', response2.url(), postData2);

  // Validar que se agregó correctamente al carrito
  await expect(page.getByText(new RegExp(`${nombre2}.*se ha añadido a tu carrito`, 'i'))).toBeVisible();
  
  // Validar que alla 2 elementos en el carrito
  const filasCarrito = page.locator('table.cart tbody tr.cart_item');
  await expect(filasCarrito).toHaveCount(2);

  // Validar nombre y precio del producto 1
  const nombreCarrito1 = await filasCarrito.nth(0).locator('.product-name a').innerText();
  const precioCarrito1 = await filasCarrito.nth(0).locator('.product-price').innerText();
  expect(nombreCarrito1).toBe(nombre1);
  expect(precioCarrito1).toBe(precio1);

  // Validar nombre y precio del producto 2
  const nombreCarrito2 = await filasCarrito.nth(1).locator('.product-name a').innerText();
  const precioCarrito2 = await filasCarrito.nth(1).locator('.product-price').innerText();
  expect(nombreCarrito2).toBe(nombre2);
  expect(precioCarrito2).toBe(precio2);

  console.log(' Validación correcta: los productos en el carrito coinciden con los seleccionados.');
  
   //Validar subtotal
  const subtotalTexto = await page.locator('.cart-subtotal .amount').innerText();
  const subtotalValor = parsePrecio(subtotalTexto);

  const sumaEsperada = parsePrecio(precio1) + parsePrecio(precio2);
  expect(subtotalValor).toBe(sumaEsperada);

  console.log(`Subtotal validado: ${subtotalValor} = ${sumaEsperada}`);
  
  await page.pause();
});

