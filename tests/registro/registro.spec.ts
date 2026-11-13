import{test, expect } from '@playwright/test'

test ('registro', async({page}, testInfo) => {
    
    await page.goto('http://127.0.0.1:5501/register.html')
    await page.locator('#name').fill('estrellita');
    await page.locator("id=last-name").fill('sandoval')
    await page.locator("xpath=//label[contains(.,'Edad')]/following-sibling::input").fill('15')
    await page.locator('#country').selectOption({ label: 'Chile' });
    await page.locator("input[value='M']").check();
    await page.locator('#email').fill('estrellita@gmail.com');
    await page.locator('#monday').check();
    await page.locator("#picture").setInputFiles("tests/imagenes/scrpit.png");
    await page.locator("id=save-btn").click()

    await testInfo.attach('registro1', {
        body: await page.screenshot(),
        contentType: 'image/png'


        }
    )
    //await page.screenshot({path: 'screenshots/registro1.png', fullPage: true})
    const actualDate = new Date().toISOString();
    console.log(actualDate);

   const [summaryPage]=await Promise.all(
[
   page.waitForEvent('popup'),
   page.locator('id=save-btn').click()


]


    ); 

await summaryPage.waitForLoadState()

await expect(summaryPage).toHaveTitle('Summary')
//await summaryPage.screenshot({path: 'screenshots/registro2.png', fullPage: true})

await testInfo.attach('registro2', {
        body: await summaryPage.screenshot(),
        contentType: 'image/png'


        }
    )

    await page.pause()


    




})