import { Page, expect } from '@playwright/test';

//Funcion para convertir un precio en texto a numero
function parsePrecio(texto: string): number {
  return Number(texto.replace(/[^\d]/g, ''));
}

//Clase para la pagina de carrito
export class CarritoPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  filas() {
    return this.page.locator('table.cart tbody tr.cart_item');
  }

  async validarProductos(nombre1: string, precio1: string, nombre2: string, precio2: string) {
    const filasCarrito = this.filas();
    await expect(filasCarrito).toHaveCount(2);

    const nombreCarrito1 = await filasCarrito.nth(0).locator('.product-name a').innerText();
    const precioCarrito1 = await filasCarrito.nth(0).locator('.product-price').innerText();
    expect(nombreCarrito1).toBe(nombre1);
    expect(precioCarrito1).toBe(precio1);

    const nombreCarrito2 = await filasCarrito.nth(1).locator('.product-name a').innerText();
    const precioCarrito2 = await filasCarrito.nth(1).locator('.product-price').innerText();
    expect(nombreCarrito2).toBe(nombre2);
    expect(precioCarrito2).toBe(precio2);

    console.log('Validación productos OK');
  }

  async validarSubtotal(precio1: string, precio2: string) {
    const subtotalTexto = await this.page.locator('.cart-subtotal .amount').innerText();
    const subtotalValor = parsePrecio(subtotalTexto);

    const sumaEsperada = parsePrecio(precio1) + parsePrecio(precio2);
    expect(subtotalValor).toBe(sumaEsperada);

    console.log(`Subtotal validado: ${subtotalValor} = ${sumaEsperada}`);
  }
}
