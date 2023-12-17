const puppeteer = require('puppeteer');

let SessionId
let browser
let page

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
  }

/**
 * Entra sul sito
 */

async function Inizializza() {
    browser = await puppeteer.launch({headless : true});
    page = await browser.newPage();
    await page.goto('https://scuoladigitale.axioscloud.it/Pages/SD/SD_Login.aspx');
    await page.setViewport({width: 1080, height: 1024});
}

/**
 * Fai il login con le credenziali fornite
 * @param {String} CF Codice Fiscale della Scuola
 * @param {String} CU Codice Utente
 * @param {String} Pwd Password dell'utente
 */

async function LoginRegistro(CF, CU, Pwd) {
    await Inizializza()
    await page.type('#customerid', CF);
    await page.type('input[placeholder="Codice utente o mail personale"]', CU);
    await page.type('input[placeholder="Password"]', Pwd);
    await page.evaluate(_ => {document.getElementsByTagName('button')[1].click()})
    await SezioneRegistroFamiglie()
    await browser.close()
}

/**
 * Entra nella sezione "Registro Famiglie" e prendi dai Cookies il SessionID
 */
async function SezioneRegistroFamiglie() {
    try {
        await page.waitForSelector('div.bg-registrofamiglie')
    } catch {
        await browser.close();
        throw new Error("Impossibile accedere al sistema. Controllare codice utente e/o password e riprovare.")
    }
    
    await page.evaluate(_ => {document.getElementsByTagName('h4')[0].click()})
    await delay(2000)
    SessionId = await page.cookies();
}

/**
 * 
 * @param {String} CF Codice Fiscale della Scuola
 * @param {String} CU Codice Utente
 * @param {String} PWD Password dell'utente
 * @returns SessionID necessario per le chiamate all'API di Axios
 */

module.exports = async function GetSessionID(CF, CU, PWD) {
    await LoginRegistro(CF, CU, PWD)
    return SessionId[0].value
}