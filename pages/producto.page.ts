import { Page, Locator, expect } from '@playwright/test';

//Clase para la pagina de producto
export class ProductoPage {

  readonly page: Page;
  readonly locator: Locator;

  constructor(page: Page, locator: Locator) {
    this.page = page;
    this.locator = locator;
  }

  // traer informacion
  locatorVisible(): Locator{
    return this.locator;
  }

  //Metodo para obtener el nombre del producto
  async obtenerNombre(): Promise<string> {
    return this.locator.locator('.caption h3.name a').innerText();
  }

  //Metodo para obtener el precio del producto
  async obtenerPrecio(): Promise<string> {
    return this.locator.locator('.caption .price').innerText();
  }

  //Metodo para agregar el producto al carrito
  async agregarAlCarrito(productId: string) {
    
    const responsePromise = this.page.waitForResponse(
      (resp) =>
        resp.url().includes('wc-ajax=add_to_cart') &&
        resp.status() >= 200 &&
        resp.status() < 300
    );

    await this.locator.hover();
    await this.locator.locator('a.add_to_cart_button').click();
    const response = await responsePromise;

    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(300);

    const postData = response.request().postData() || '';
    expect(postData).toContain(`product_id=${productId}`);

    console.log(`Respuesta red producto ${productId}:`, response.url());
  }
}
