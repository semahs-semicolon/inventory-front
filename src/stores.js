import { writable } from "svelte/store";

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