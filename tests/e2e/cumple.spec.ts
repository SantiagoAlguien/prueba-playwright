import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/home.page';
import { CategoriaPage } from '../../pages/categoria.page';
import { ProductoPage } from '../../pages/producto.page';
import { CarritoPage } from '../../pages/carrito.page';

test('Agregar y eliminar producto del carrito', async ({ page }, testInfo) => {
  const home = new HomePage(page);
  const categoria = new CategoriaPage(page);
  const carrito = new CarritoPage(page);

  // Paso 1: Home
  await home.goto();
  await testInfo.attach('Paso 1 - Home', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });

  // Paso 2: Categoría Cumpleaños
  await page.locator('#menu-item-2799 a').click();
  await testInfo.attach('Paso 2 - Categoría Cumpleaños', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });

  // Paso 3: Seleccionar primer producto de la categoría
  const producto = new ProductoPage(page, categoria.productoPorId('4065')); // id de ejemplo
  const nombre = await producto.obtenerNombre();
  const precio = await producto.obtenerPrecio();
  await producto.agregarAlCarrito('4065');
  await testInfo.attach('Paso 3 - Producto agregado desde Cumpleaños', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });

  // Paso 4: Verificar carrito con producto agregado
  const filasCarrito = carrito.filas();
  await expect(filasCarrito).toHaveCount(1);
  await testInfo.attach('Paso 4 - Carrito con producto agregado', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });

  // Paso 4: Validar nombre y precio
  const nombreCarrito = await filasCarrito.nth(0).locator('.product-name a').innerText();
  const precioCarrito = await filasCarrito.nth(0).locator('.product-price').innerText();
  expect(nombreCarrito).toBe(nombre);
  expect(precioCarrito).toBe(precio);

  // Paso 5 - Screenshot antes de eliminar
  await testInfo.attach('Paso 5a - Antes de eliminar producto', {
  body: await page.screenshot(),
  contentType: 'image/png',});

  await filasCarrito.nth(0).locator('.product-remove a').click();

  // Esperar el mensaje de carrito vacío
  await expect(page.locator('.cart-empty')).toBeVisible();

  // Paso 5 - Screenshot después de eliminar
  await testInfo.attach('Paso 5b - Después de eliminar producto', {
  body: await page.screenshot(),
  contentType: 'image/png',});
  
});