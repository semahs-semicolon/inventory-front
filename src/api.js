import { get }from 'svelte/store';
import { ACCESS_TOKEN } from "./stores";

import { dev } from '$app/environment';

export const API_URL = () => `https://${dev ? 'internal.inventory.seda.club' : location.hostname}/api`
// export const API_URL = () => `http://127.0.0.1:8080`
// export const API_URL = () => "https://internal.inventory.seda.club/api"
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

export function imageIdToUrl(id, options = "200,fit,jpeg") {
    return `https://${dev ? 'internal.inventory.seda.club' : location.hostname}/scaled/${options}/images/${id}`;
    // return `https://s4.cloud.seda.club/swift/v1/AUTH_7913d9d4f87343c28de59cf00a57ef44/images/${id}`
}