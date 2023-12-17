var itemCounter = require('../utils/StringSort.js')
var taglia = require('../utils/taglia.js')

/**
 * 
 * 
 * 
 * @param {String} rawData - HTML preso dalla tabella dei compiti e verifiche
 * @returns JSON contente tutti i compiti e altre informzioni riguardanti essi
 * 
 */

module.exports = function parseCompiti(rawData) {
    var result = '{'
    var sub = 0
    rawData = JSON.parse(rawData);
    for (let i = 0; i < Object.keys(rawData.data).length; i++) {
        if (rawData.data[i].testo !== '') {
            result = result + '"' + (i - sub) +'": {"Materia": "' + rawData.data[i].materia  + '", "Data": "' + rawData.data[i].giorno + '", "Compito": "' + rawData.data[i].testo.replace(/(?:\r\n|\r|\n)/g, '\\n ') + '", "Prof": "'+ rawData.data[i].inserito.split('<br>')[0] + '"},'
        } else {
            sub++
        }
    }
    result = result.slice(0, -1) + '}'
    return JSON.parse(result)
}
