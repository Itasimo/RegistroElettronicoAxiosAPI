/**
 * 
 * #### Curriculum
 * 
 * @param {String} rawData - JSON preso dalla chiamata all'API di Axios
 * @returns {JSON} JSON contente tutte le informazioni riguardanti il curriculum scolastico dello studente
 * 
 */

module.exports = function parseCurriculum(rawData) {

    let result = []

    for (let i = 0; i < rawData.length; i++) {
        const currData = {
            codiceMeccanografico: rawData[i].idPlesso,          // Es: CRAA123456Z
            scuola: rawData[i].descScuola,
            indirizzo: rawData[i].descCorso,
            annoScolastico: rawData[i].annoScolastico.split('/'),
            classe: rawData[i].classe.toString(),
            sezione: rawData[i].sezione,
            esito: rawData[i].descEsito,
            crediti: rawData[i].credito == '' ? 0 : Number(rawData[i].credito)
        }

        result.push(currData)
    }

    return result;
}