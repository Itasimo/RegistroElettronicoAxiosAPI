import rc4 from './rc4.mjs';

const AxiosJSON_URL = "https://raw.githubusercontent.com/Itasimo/RegistroElettronicoAxiosAPI/main/RegistroElettronicoAxiosAPI/AxiosJSON/axios.json";
let AxiosJSON;
await fetch(AxiosJSON_URL).then(response => response.json()).then(data => AxiosJSON = data)
const rc4key = AxiosJSON.rc4key.new;

/**
 * 
 * @param {JSON} json  JSON da codificare
 * @param {Number} num  Numero di volte che si vuole codificare con Url Encoding
 * @returns Encoded string
 */
export default function AxiosEncode(json, num = 1) {

    let encoded = rc4(rc4key, JSON.stringify(json));

    encoded = btoa(encoded);

    for (let i = 0; i < num; i++) {encoded = encodeURIComponent(encoded)};

    return encoded;
}