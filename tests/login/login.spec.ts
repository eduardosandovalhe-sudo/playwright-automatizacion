import { test, expect } from '@playwright/test';
import { LogginPage } from '../../pageobjects/login/Login';
import { AddTransactionPage } from '../../pageobjects/Agregar-transaccion/Add-transaction';
import { faker } from '@faker-js/faker';
import { Navegar } from '../../pageobjects/navegar/Navegar';

test('login', async ({ page }) => {
  await test.step('Navigating to login page', async() =>{
  const navegar = new Navegar(page);
  await navegar.loginPage();

  })


  const transactionDate = '2023-12-21';
  const transactionAmount = faker.number.int({ min: 500, max: 5000 }).toString();
  const transactionDescrption = faker.food.description();
  


   await test.step('login', async() =>{
  const logginPage = new LogginPage(page);
  await logginPage.doLogin('user', 'pass');

  })
  
await test.step('add transaction', async () => {
  const addTransactionPage = new AddTransactionPage(page);
  await addTransactionPage.addTransaction(transactionDate, transactionAmount, transactionDescrption);
  expect(await addTransactionPage.getActualDate("1")).toEqual(transactionDate);
  expect(await addTransactionPage.getActualAmount("1")).toEqual(transactionAmount);
  expect(await addTransactionPage.getActualDescription("1")).toEqual(transactionDescrption);
});


  

  
});