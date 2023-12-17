
/**
 * 
 * 
 * 
 * @param {String} rawData - HTML preso dalla tabella dei compiti e verifiche
 * @returns JSON contente tutte le verifiche e altre informzioni riguardanti essi
 * 
 */

//{"Materia":"MATEMATICA","Data":"12/01/2024","Verifica":" Verifica di matematica: radicali","Prof":"Dacco' Antonella"}

module.exports = function parseCompiti(rawData) {
    var result = '{'
    var sub = 0
    rawData = JSON.parse(rawData);
    for (let i = 0; i < Object.keys(rawData.data).length; i++) {
        if (rawData.data[i].verifica !== '') {
            result = result + '"' + (i - sub) +'": {"Materia": "' + rawData.data[i].materia  + '", "Data": "' + rawData.data[i].giorno + '", "Verifica": "' + rawData.data[i].verifica.replace(/(?:\r\n|\r|\n)/g, '\\n ') + '", "Prof": "'+ rawData.data[i].inserito.split('<br>')[0] + '"},'
        } else {
            sub++
        }
    }
    result = result.slice(0, -1) + '}'
    return JSON.parse(result)
}