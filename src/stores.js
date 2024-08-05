import { derived, writable } from "svelte/store";

const accessToken = typeof window != 'undefined'  && localStorage.getItem("token") || null;

export const ACCESS_TOKEN = writable(accessToken);

ACCESS_TOKEN.subscribe((value) => {
    if (typeof window != 'undefined') {
        if (value) localStorage.setItem("token", value);
        else localStorage.removeItem("token")
    }
})

export const LAST_URL = writable(undefined);

export const SEARCH = writable("");
export const LAST_SEARCH_RESULT =writable([]);

export const CATEGORIES = writable({});


function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

export const USER_ID = derived(ACCESS_TOKEN, $token => {
    try {
        return parseJwt($token).sub;
    } catch(e) {
        return undefined;
    }
});
export const AUTHORITIES = derived(ACCESS_TOKEN, $token => {
    try {
        return parseJwt($token).authorities;
    } catch(e) {
        return undefined;
    }
});
