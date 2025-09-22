import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/home.page';
import { CategoriaPage } from '../../pages/categoria.page';
import { ProductoPage } from '../../pages/producto.page';
import { CarritoPage } from '../../pages/carrito.page';
import { evidencia } from '../../fixtures/evidencia';

test('Agregar productos de la categoría Amor al carrito', async ({ page }) => {
  const home = new HomePage(page);
  const categoria = new CategoriaPage(page);
  const carrito = new CarritoPage(page);

  await home.goto();
  await evidencia(page, 'Paso 1 - Home');
  await home.irCategoriaAmor();
  await evidencia(page, 'Paso 2 - Categoría Amor');
  await categoria.filtrar();
  await evidencia(page, 'Paso 3 - Filtro aplicado');

  // Producto 1
  const prod1 = new ProductoPage(page, categoria.productoPorId('4100'));
  const nombre1 = await prod1.obtenerNombre();
  const precio1 = await prod1.obtenerPrecio();
  await prod1.agregarAlCarrito('4100');
  await evidencia(page, 'Paso 4 - Producto 1 agregado');

  await page.getByRole('link', { name: 'Seguir comprando' }).click();
  await evidencia(page, 'Paso 5 - Seguir comprando');

  // Producto 2
  const prod2 = new ProductoPage(page, categoria.productoPorId('4096'));
  const nombre2 = await prod2.obtenerNombre();
  const precio2 = await prod2.obtenerPrecio();
  await prod2.agregarAlCarrito('4096');
  await evidencia(page, 'Paso 6 - Producto 2 agregado');

  // Validaciones en el carrito
  await carrito.validarProductos(nombre1, precio1, nombre2, precio2);
  await evidencia(page, 'Paso 7 - Validación productos en carrito');
  await carrito.validarSubtotal(precio1, precio2);
  await evidencia(page, 'Paso 8 - Validación subtotal en carrito');
});
