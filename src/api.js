import { get }from 'svelte/store';
import { ACCESS_TOKEN } from "./stores";


export const API_URL = "https://seda-inventory.kro.kr/api"
// export const API_URL = "http://192.168.219.100/panel/api"

export function authfetch(input, init={method: 'GET', headers: {}}) {
    init.headers = init.headers || {}
    let token = get(ACCESS_TOKEN)
    if (token !== null)
        init.headers['Authorization'] = 'Bearer '+token
    return fetch(input, init).then(res => {
        if (res.status == 401) ACCESS_TOKEN.set(null);
        return res;
    });
} 

// export function hasRole(jwt, roles) {
//     let payload = jwt.split(".")[1]
//     let payload_json = JSON.parse(atob(payload))
//     for (let role of roles) {
//         if (payload_json.roles.includes(role)) {
//             return true;
//         }
//     }
//     return false;
// }

export function imageIdToUrl(id) {
    return `https://seda-inventory.kro.kr/s3/images/${id}`;
}