
const modules = {
    GetSessionID: require("./GetSessionID.js"),
    parseCompiti: require("./Parse/parseCompiti.js"),
    parseVoti: require("./Parse/parseVoti.js"),
    parseVerifiche: require("./Parse/parseVerifiche.js")
}


let SessionId

/**
 * 
 * Codice generato da Postman (https://www.postman.com/)
 * 
 * @param {String} Action Azione da eseguire
 * @param {String} Cookies Cookies contenti SessionID e altri eventuali dati
 * @param {String} body Corpo della chiamata contenente informazioni sul formato della risposta
 * @returns JSON non analizzato contenete la risposta
 */

async function AxiosAPI(Action, Cookies, body) {
    var raw_JSON

    var myHeaders = new Headers();
    myHeaders.append("sec-ch-ua", "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"");
    myHeaders.append("RVT", "QUI5QUU0N0Q0NzkzQzg4MjZEM0IxQjJDQUI5NkUxNjQ=");
    myHeaders.append("sec-ch-ua-mobile", "?0");
    myHeaders.append("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    myHeaders.append("Accept", "application/json, text/javascript, */*; q=0.01");
    myHeaders.append("X-Requested-With", "XMLHttpRequest");
    myHeaders.append("sec-ch-ua-platform", "\"Windows\"");
    myHeaders.append("host", "registrofamiglie.axioscloud.it");
    myHeaders.append("Cookie", Cookies);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: body,
      redirect: 'follow'
    };

    await fetch("https://registrofamiglie.axioscloud.it/Pages/APP/APP_Ajax_Get.aspx?Action=" + Action, requestOptions) //Endpoint
      .then(response => response.text())
      .then(result => raw_JSON  = result)
      .catch(error => console.log('error', error));

    return raw_JSON
}

/**
 * 
 * @param {String} CodiceFiscale Codice Fiscale della Scuola
 * @param {String} CodiceUtente Codice dell' Utente
 * @param {String} Password Password dell'utente
 * @param {String} Azione Azione che si vuole effettuare:
 *                          - **"Compiti"**: contiene tutti i compiti pubblicati fino al momento della chiamata e informazioni riguardanti: materia, data di consegna, compito, professore;
 *                          - **"Verifiche"**: contiene tutte le verifiche pubblicate fino al momento della chiamata e informazioni riguardanti: materia, data della verifica, argomenti della verifica, professore;
 *                          - **"Voti"**: contiene tutti i voti pubblicati fino al momento della chiamata e informazioni riguardanti: materia, tipo di voto, voto, data, eventuali commenti, professore;
 * @returns JSON contenete la risposta
 */

module.exports = async function RegistroElettronicoAxiosAPI(CodiceFiscale, CodiceUtente, Password, Azione) {

    SessionId = await modules.GetSessionID(CodiceFiscale, CodiceUtente, Password)

    const Compiti = {
        Action: 'FAMILY_REGISTRO_CLASSE_COMPITI_LISTA',
        Cookies: "ASP.NET_SessionId="+ SessionId + "; Path=/; Secure; HttpOnly;",
        body: "{\"draw\":1,\"columns\":{},\"order\":[],\"start\":0,\"length\":-1,\"search\":{\"value\":\"\",\"regex\":false},\"iMatId\":\"\"}" // "length": -1 restituisce tutti i dati
    }
    const Verifiche = {
        Action: 'FAMILY_REGISTRO_CLASSE_COMPITI_LISTA',
        Cookies: "ASP.NET_SessionId="+ SessionId + "; Path=/; Secure; HttpOnly;",
        body: "{\"draw\":1,\"columns\":{},\"order\":[],\"start\":0,\"length\":-1,\"search\":{\"value\":\"\",\"regex\":false},\"iMatId\":\"\"}"
    }
    const Voti = {
        Action: 'FAMILY_VOTI_ELENCO_LISTA',
        Cookies: "ASP.NET_SessionId="+ SessionId + "; Path=/; Secure; HttpOnly;",
        body: "{\"draw\":1,\"columns\":{},\"order\":[],\"start\":0,\"length\":-1,\"search\":{\"value\":\"\",\"regex\":false},\"iMatId\":\"\",\"frazione\":\"uPiKweV3jQncViK72kP+QpJf+DWCv5XeTYnULt+zgqtncwKHJMfOnj7Sx/IWAVZDGJjSugVF/4AIMFPN9z4H6G4ZjWk=\"}"
    }

    switch (Azione) {
        case 'Compiti':
            return modules.parseCompiti(await AxiosAPI(Compiti.Action, Compiti.Cookies, Compiti.body))
        case 'Voti':
            return modules.parseVoti(await AxiosAPI(Voti.Action, Voti.Cookies, Voti.body))
        case 'Verifiche':
            return modules.parseVerifiche(await AxiosAPI(Verifiche.Action, Verifiche.Cookies, Verifiche.body))
        default:
            throw new Error("Azione non supportata")
    }
}

