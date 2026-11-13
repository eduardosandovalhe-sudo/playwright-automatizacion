import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('comprar productos', async ({ page }) => {
  await page.goto('http://127.0.0.1:5503');

  // Bucle para agregar 6 veces el primer producto
  for (let i = 0; i <= 5; i++) {
    await page.getByRole('button', { name: 'Añadir al carrito' }).first().click();
  }

  await page.getByRole('button', { name: 'Añadir al carrito' }).nth(1).click();
  await page.getByRole('button', { name: 'Añadir al carrito' }).nth(2).click();
  await page.getByRole('button', { name: 'Ver Carrito' }).click();

  // Validaciones del carrito
  const producto1Cell = page.getByRole('row', { name: 'Producto 1' }).getByRole('cell').nth(2);
  const producto2Cell = page.getByRole('row', { name: 'Producto 2' }).getByRole('cell').nth(2);
  const producto3Cell = page.getByRole('row', { name: 'Producto 3' }).getByRole('cell').nth(2);

  await expect(producto1Cell).toHaveText('6');
  await expect(producto2Cell).toHaveText('1');
  await expect(producto3Cell).toHaveText('1');

  await page.locator('#checkout-btn').click();

  // Datos de envío
  await page.locator('#name').fill(faker.person.fullName());
  await page.locator('#email').fill(faker.internet.email());
  await page.locator('#address').fill(faker.location.streetAddress());

  // Navegación a información de pago sin usar waitForTimeout
  const linkPago = page.locator("//a[@href='#paymentInfo']");
  await linkPago.waitFor({ state: 'visible' });
  await linkPago.click();

  // Datos de tarjeta
  await page.locator('#card-number').fill(faker.finance.creditCardNumber());
  await page.locator('#card-expiry').fill('12/26');
  await page.locator('#card-cvc').fill('123'); // CVC estático de 3 dígitos

  // Corrección del ID del botón (place en lugar de placer) o clic por rol
  const botonRealizarPedido = page.locator('#place-order-btn'); 
  // Alternativa por rol: page.getByRole('button', { name: /realizar pedido|place order/i });
  
  await botonRealizarPedido.click();

  // Verificación del mensaje final
  await expect(page.getByRole('heading', { name: /tu compra fue exitosa/i })).toBeVisible();
});