import { Locator, Page } from "@playwright/test";

export class LogginPage {
  private readonly usernameTextbox: Locator;
  private readonly passwordInput: Locator;
  private readonly logginButton: Locator;

  constructor(page: Page) {
    this.usernameTextbox = page.locator('input#username');
    this.passwordInput = page.locator('input#password');
    this.logginButton = page.locator("//button[@type='submit']");
  }

  private async fillUsername(username: string) {
    // Usar el parámetro 'username', no el texto literal 'username'
    await this.usernameTextbox.fill(username);
  }

  private async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  private async clickOnLoginButton() {
    await this.logginButton.click();
  }

  async doLogin(username: string, password: string) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickOnLoginButton(); // Agregado el await
  }
}