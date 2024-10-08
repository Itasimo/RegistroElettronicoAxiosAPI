/**
 * 
 * #### Verifiche
 * 
 * @param {String} rawData - JSON preso dalla chiamata all'API di Axios
 * @returns {JSON} JSON contente tutte le verifiche e altre informzioni riguardanti essi
 * 
 */

export default function parseVerifiche(rawData) {
    
    var result = []

    // La risposta di axios è un array di oggetti, prima ci sono i compiti e poi le verifiche quindi inizia dalla prima verifica saltando la prima parte composta solo da compiti

    for (
            let i = (rawData.findIndex(obj => obj.tipo_nota == '6') === -1 ? rawData.length : rawData.findIndex(obj => obj.tipo_nota == '6')); // Trova l'indice del prima verifica e inizia da lì skippado i compiti

            i < rawData.length;

            i++

        ) {


            result.push({
                materia: rawData[i].descMat,
                verifica: rawData[i].descCompiti.split('</b>')[1].trim(),
                perGiorno: rawData[i].data.split(' ')[0],
                pubblicato: [
                    rawData[i].data_pubblicazione.split(' ')[0],
                    rawData[i].data_pubblicazione.split(' ')[1]
                ],
            })
    
        }
    
        return result;
}