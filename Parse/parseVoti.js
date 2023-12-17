
/**
 * 
 * 
 * 
 * @param {String} rawData - HTML preso dalla tabella dei voti
 * @returns JSON contente tutti i voti e altre informzioni riguardanti essi
 * 
 */



module.exports = function parseVoti(rawData) {
    var result = '{'
    rawData = JSON.parse(rawData);
    for (let i = 0; i < Object.keys(rawData.data).length; i++) {
        result = result + '"' + i +'":{"Materia":"' + rawData.data[i].materia + '","Tipo":"' + rawData.data[i].tipo + '","Voto":"' + rawData.data[i].voto.split('>')[4].split('<')[0] + '","Media?":' + !(rawData.data[i].voto.split(" ").includes("label-primary'")) + ',"Data":"' + rawData.data[i].giorno + '","Commenti":"' + rawData.data[i].commento + '","Prof":"' + rawData.data[i].docente + '"},'
    }
    result = result.slice(0, -1) + '}'
    return JSON.parse(result)
}