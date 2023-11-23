import puppeteer from 'puppeteer';
import parseVoti from "./Parse/parseVoti.js"
import parseCompiti from "./Parse/parseCompiti.js"
import parseVerifiche from "./Parse/parseVerifiche.js"


function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}



let browser
let page


/**
 *
 * Inizializza puppeteer e apri la pagina del registro scuoladigitale.axioscloud.it
 *  
*/

async function Inizializza() {
    browser = await puppeteer.launch({headless : true});
    page = await browser.newPage();
    await page.goto('https://scuoladigitale.axioscloud.it/Pages/SD/SD_Login.aspx');
    await page.setViewport({width: 1080, height: 1024});
}




/**
 * 
 * @param {String} CF - Codice fiscale della scuola
 * @param {String} CU - Codice utente dell'account dello studente
 * @param {String} Pwd - Password dell'account dello studente
 * 
*/

async function LoginRegistro(CF, CU, Pwd) {
    await Inizializza()
    await page.type('#customerid', CF);
    await page.type('input[placeholder="Codice utente o mail personale"]', CU);
    await page.type('input[placeholder="Password"]', Pwd);
    await page.evaluate(_ => {document.getElementsByTagName('button')[1].click()})
}

/**
 * Permette di entrare nella sezione "Registro Famiglie", presente solo per non ripetere il codice nelle altre funzioni
*/
async function SezioneRegistroFamiglie() {
    try {
        await page.waitForSelector('div.bg-registrofamiglie')
    } catch {
        await browser.close();
        throw new Error("Impossibile accedere al sistema. Controllare codice utente e/o password e riprovare.")
    }
    
    await page.evaluate(_ => {document.getElementsByTagName('h4')[0].click()})
    await page.waitForSelector('#content-alunno')
}




async function retryVoti() {
    try {
        await page.evaluate(_ => {document.getElementsByTagName('select')[2].value = '-1'})
        await page.evaluate(_ => {document.getElementsByTagName('select')[2].dispatchEvent(new Event('change'))})
        return
    } catch (error) {
        retryVoti()
    }
}

/**
 * Apre la sezione "Voti" e restituisce un file JSON contenente le informazioni
*/
async function Voti() {
    await SezioneRegistroFamiglie()
    // Entra nella sezione "Voti"
    await page.evaluate(_ => {document.getElementsByTagName('i')[25].click()}) 
    await delay(2000)

    // Imposta la modalità di visulaizzazione della tabella a "Tutti" per raccogliere tutti i voti in una singola tabella
    await retryVoti()
    // Quando ha finito di caricare la tabella dei voti continua
    await page.waitForFunction('document.querySelector("#table-voti_info").innerText === "Totale pagine 1 di 1"')
    
    // Transforma i dati da Raw a JSON
    //await parseVoti( await page.$eval('tbody', (element) => {return element.innerHTML}))
    var data = await parseVoti( await page.$eval('tbody', (element) => {return element.innerHTML}));
    await browser.close();

    return data
}





async function retryCompiti() {
    try {
        await page.evaluate(_ => {document.getElementsByTagName('select')[1].value = '-1'})
        await page.evaluate(_ => {document.getElementsByTagName('select')[1].dispatchEvent(new Event('change'))})
        return
    } catch (error) {
        retryCompiti()
    }
}

/**
 * Apre la sezione "Registro di Classe" e restituisce un file JSON contenente le informazioni riguardanti i compiti
*/
async function Compiti() {
    await SezioneRegistroFamiglie()
    // Entra nella sezione "Registro di Classe"
    await page.evaluate(_ => {document.getElementsByTagName('i')[23].click()})
    // Apri la sezione "Compiti e Verifiche"
    await delay(1000)
    await page.evaluate(_ => {document.getElementsByTagName('i')[22].click()})
    await delay(2000)

    // Imposta la modalità di visulaizzazione della tabella a "Tutti" per raccogliere tutti i compiti in una singola tabella
    await retryCompiti()
    // Quando ha finito di caricare la tabella dei compiti continua
    await page.waitForFunction('document.querySelector("#table-compiti_info").innerText === "Totale pagine 1 di 1"')

    // Transforma i dati da Raw a JSON
    var data = await parseCompiti( await page.$eval('tbody', (element) => {return element.innerHTML}))

    await browser.close();

    return data
}



async function retryVerifiche() {
    try {
        await page.evaluate(_ => {document.getElementsByTagName('select')[1].value = '-1'})
        await page.evaluate(_ => {document.getElementsByTagName('select')[1].dispatchEvent(new Event('change'))})
        return
    } catch (error) {
        retryVerifiche()
    }
}

/**
 * Apre la sezione "Registro di Classe" e restituisce un file JSON contenente le informazioni riguardanti i compiti
*/
async function Verifiche() {
    await SezioneRegistroFamiglie()
    // Entra nella sezione "Registro di Classe"
    await page.evaluate(_ => {document.getElementsByTagName('i')[23].click()})
    // Apri la sezione "Compiti e Verifiche"
    await delay(1000)
    await page.evaluate(_ => {document.getElementsByTagName('i')[22].click()})
    await delay(2000)

    // Imposta la modalità di visulaizzazione della tabella a "Tutti" per raccogliere tutti i compiti in una singola tabella
    await retryVerifiche()
    // Quando ha finito di caricare la tabella dei compiti continua
    await page.waitForFunction('document.querySelector("#table-compiti_info").innerText === "Totale pagine 1 di 1"')

    // Transforma i dati da Raw a JSON
    var data = await parseVerifiche( await page.$eval('tbody', (element) => {return element.innerHTML}))

    await browser.close();

    return data
}






export async function RegistroAxiosAPI(CodiceFiscale, CodiceUtente, Password, Azione) {
    await LoginRegistro(CodiceFiscale, CodiceUtente, Password)
    switch (Azione) {
        case 'Compiti':
            return await Compiti()
        case 'Voti':
            return await Voti()
        case 'Verifiche':
            return await Verifiche()
        default:
            throw new Error("Azione non supportata")
    }
}


/**
 * 
    await delay(4000)
    await page.screenshot({path: 'screenshot.png'});
 * 
*/