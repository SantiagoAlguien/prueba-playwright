import { Page } from '@playwright/test';

//Clase para la pagina de inicio
export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  
  //Metodo para ir a la pagina de inicio
  async goto() {
    await this.page.goto('https://www.floristeriamundoflor.com/');
  }

  //Metodo para ir a la categoria Amor
  async irCategoriaAmor() {
    await this.page.locator('#menu-item-2806 a').click();
  }

  locatorVisible() {
    return this.page.locator('#menu-item-2806 a'); // enlace Amor
  }
  
}
