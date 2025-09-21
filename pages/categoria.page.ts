import { Page, Locator } from '@playwright/test';
//Clase para la pagina de categoria
export class CategoriaPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  //Metodo para filtrar productos
  async filtrar() {
    await this.page.getByRole('button', { name: 'Filtrar' }).click();
  }
  
  //Metodo para seleccionar un producto por su ID
  productoPorId(id: string): Locator {
    return this.page.locator(`.product-block[data-product-id="${id}"]`);
  }
}
