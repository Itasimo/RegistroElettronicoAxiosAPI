var itemCounter = require('../utils/StringSort.js')
var taglia = require('../utils/taglia.js')

/**
 * 
 * 
 * 
 * @param {String} rawData - HTML preso dalla tabella dei compiti e verifiche
 * @returns JSON contente tutte le verifiche e altre informzioni riguardanti essi
 * 
 */

module.exports = async function parseVerifiche(rawData) {
    var result = '{'
    var sub = 0

    for (let i = 0; i < itemCounter(rawData.replaceAll('>', '˄').replaceAll('<', '˄').split('˄'), '/tr'); i++) {
        
         /**
         * La formula per trovare gli elementi è:
         * 
         * p + i * s
         * 
         * i = index
         * p = prima volta in cui si trova l'elemento nella lista
         * s = sequenza, in questo caso dopo 26 elementi si ritovava lo stesso tipo di elemento
         * 
         */
        
         if (rawData.replaceAll('>', '˄').replaceAll('<', '˄').split('˄')[i*26+16].replaceAll('"', "'") !== '') {
            result = result + ',"'+ (i - sub) +'": {"Materia": "' + rawData.replaceAll('>', '˄').replaceAll('<', '˄').split('˄')[i*26+8].replaceAll('"', "'").replace(/(?:\r\n|\r|\n)/g, '\\n ') + '", "Data": "' + rawData.replaceAll('>', '˄').replaceAll('<', '˄').split('˄')[i*26+4] + '", "Verifica": "' + rawData.replaceAll('>', '˄').replaceAll('<', '˄').split('˄')[i*26+16].replaceAll('"', "'").replace(/(?:\r\n|\r|\n)/g, '\\n ') + '", "Prof": "' + rawData.replaceAll('>', '˄').replaceAll('<', '˄').split('˄')[i*26+20].replaceAll('"', "'").replace(/(?:\r\n|\r|\n)/g, '\\n ') + '"}'  
        } else {
            sub++
        }
        
    }

    result = taglia(result, 2) + '}'


    return JSON.parse(result)
}