import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.setTimeout(120000);

test('crear muchas transacciones', async ({ page }) => {
  // 1. Usar el puerto del servidor local
  await page.goto('http://localhost:3000/login.html');

  // 2. Login
  await page.locator('input#username').fill('user');
  await page.locator('input#password').fill('pass');
  await page.locator('//button[@type=\'submit\']').click();

  // 3. Crear las transacciones
  for (let i = 0; i < 10; i++) {
    // Abrir modal
    await page.locator('//button[contains(text(),\'Añadir transacción\')]').click();

    // Esperar a que el modal sea visible de verdad
    const modal = page.locator('#transactionModal');
    await modal.waitFor({ state: 'visible' });

    // Rellenar campos
    await page.locator('#date').fill('2026-10-21');
    await page.locator('#amount').fill(faker.number.int({ min: 100, max: 200 }).toString());
    await page.locator('#description').fill(`Description testing ${i + 1}`);

    // Guardar
    await page.locator('//button[contains(text(),\'Guardar\')]').click();

    // Esperar a que el modal se oculte
    await modal.waitFor({ state: 'hidden' });
  }

  // Editar la primera
  await page.getByRole('button', { name: 'Editar' }).first().click();

  await page.pause();
});
