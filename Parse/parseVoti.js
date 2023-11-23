var itemCounter = require('../utils/StringSort.js')

/**
 * 
 * 
 * 
 * @param {String} rawData - HTML preso dalla tabella dei voti
 * @returns JSON contente tutti i voti e altre informzioni riguardanti essi
 * 
 */

module.exports = async function parseVoti(rawData) {
                    var votiTotali = 0
                    var result = '{'
                    
                    for (let i = 0; i < itemCounter(rawData.replaceAll('>', '˄').replaceAll('<', '˄').split('˄'), '/tr'); i++) {
                        /**
                         * La formula per trovare gli elementi è:
                         * 
                         * p + i * s
                         * 
                         * i = index
                         * p = prima volta in cui si trova l'elemento nella lista
                         * s = sequenza, in questo caso dopo 48 elementi si ritovava lo stesso tipo di elemento
                         * 
                         */
                        result = result + '"'+ i +'": {"Materia":"' + rawData.replaceAll('>', '˄').replaceAll('<', '˄').split('˄')[8+i*48] + '", "Tipo": "' + rawData.replaceAll('>', '˄').replaceAll('<', '˄').split('˄')[12+i*48] + '", "Voto": "' + rawData.replaceAll('>', '˄').replaceAll('<', '˄').split('˄')[24+i*48]  + '", "Media?": "' + !(rawData.replaceAll('>', '˄').replaceAll('<', '˄').split('˄')[17+i*48].split(" ").includes('label-primary"')) + '", "Data": "' + rawData.replaceAll('>', '˄').replaceAll('<', '˄').split('˄')[4+i*48] + '", "Commenti": "' + rawData.replaceAll('>', '˄').replaceAll('<', '˄').split('˄')[30+i*48] + '", "Prof": "' + rawData.replaceAll('>', '˄').replaceAll('<', '˄').split('˄')[34+i*48] + '"},'
                        votiTotali++
                    }
                
                    result = result + '"Numero voti": "'+  votiTotali++ +'"}'

                    //result = 

                    return JSON.parse(result)
}