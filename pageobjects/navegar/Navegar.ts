import { Page } from '@playwright/test';
export class Navegar {
     private readonly page:Page
    constructor(page: Page){
        this.page = page

    }
    async loginPage(){
        
  await this.page.goto('file:///C:/Users/eduar/Downloads/recursos/recursos/login/login.html');
    }

}