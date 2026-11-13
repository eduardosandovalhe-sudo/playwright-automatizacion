const { chromium } = require("@playwright/test");
const { spawn } = require("child_process");

(async () => {
    const chrome = spawn(
        "C:/Program Files/Google/Chrome/Application/chrome.exe",
        [
            "--remote-debugging-port=9222",
            "--user-data-dir=D:/playwright-poc/chrome-profile"
        ]
    );
    await new Promise(r => setTimeout(r, 3_000));
    
    const browser = await chromium.connectOverCDP("http://127.0.0.1:9222");
    const defaultContext = browser.contexts()[0];
    const page = defaultContext.pages()[0];

    // Búsqueda enfocada directamente en reclutadores del área TI/Tech de 2º grado
    await page.goto("https://www.linkedin.com/search/results/people/?keywords=%22IT%20Recruiter%22%20OR%20%22Tech%20Recruiter%22%20OR%20%22Reclutador%20TI%22%20OR%20%22Reclutador%20IT%22&network=%5B%22S%22%5D&page=1");

    await page.waitForTimeout(5000);

    const connectElements = page.locator("//main//*[self::a or self::button][normalize-space()='Conectar']");
    const count = await connectElements.count();

    console.log("Elementos 'Conectar' encontrados:", count);

    if (count === 0) {
        console.log("No se encontraron enlaces ni botones 'Conectar' en esta página.");
        await browser.close();
        return;
    }

    const cardsLocator = page.locator("//main//*[self::a or self::button][normalize-space()='Conectar']/ancestor::div[.//a[contains(@href, '/in/')]][1]");
    const allContacts = await cardsLocator.all();

    // Filtro 1: Debe ser del área de reclutamiento/selección
    const recruiterKeywords = [
        "reclutador",
        "reclutadora",
        "reclutamiento",
        "recruiter",
        "recruiting",
        "selección",
        "seleccion",
        "talento",
        "talent",
        "headhunter",
        "acquisition"
    ];

    // Filtro 2: Debe pertenecer al rubro TI / Tecnología / Software
    // Usamos regex con límites de palabra (\b) para evitar falsos positivos con "it" o "ti" dentro de otras palabras
    const techRegex = /\b(it|ti|tech|tecnología|tecnologia|software|digital|sistemas|informática|informatica|startups|developer|qa)\b/i;
    
    const contactsThatMatch = [];

    for (let contact of allContacts) {
        let cardText = await contact.innerText();
        let cleanText = cardText.replace(/\n+/g, " | ").trim();
        let lowerText = cleanText.toLocaleLowerCase();

        const isRecruiter = recruiterKeywords.some(word => lowerText.includes(word));
        const isTech = techRegex.test(lowerText);

        if (isRecruiter && isTech) {
            contactsThatMatch.push({ element: contact, info: cleanText });
        } else {
            console.log("Descartado (no cumple doble filtro):", cleanText);
        }
    }

    console.log("-----------------------------------------");
    console.log("Total de reclutadores TI a agregar:", contactsThatMatch.length);

    for (let item of contactsThatMatch) {
        console.log("Agregando a:", item.info);
        const btn = item.element.locator("//*[self::a or self::button][normalize-space()='Conectar']").first();
        
        if (await btn.isVisible()) {
            await btn.click();
            await page.waitForTimeout(1000);

            const sendWithoutNote = page.locator("//*[self::button or self::a][contains(., 'Enviar sin nota')]");
            if (await sendWithoutNote.isVisible()) {
                await sendWithoutNote.click();
            }

            await page.waitForTimeout(1500);
        }
    }

    console.log("Proceso finalizado.");
    await browser.close();
})();

    