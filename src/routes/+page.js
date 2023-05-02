import { get } from "svelte/store";
import { ACCESS_TOKEN } from "../stores";
import { redirect } from "@sveltejs/kit";

export const ssr = false;
export const csr = true;
export const prerender = false;

export async function load({ params }) {
    if (get(ACCESS_TOKEN) == null) throw redirect(301, "/signin");
    throw redirect(301, "/dashboard");
}