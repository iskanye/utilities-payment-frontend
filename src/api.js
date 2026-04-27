import { log } from "./log.js";

export let API_BASE = localStorage.getItem("utilities_api_base") || "";

export function setBaseUrl(url) {
    API_BASE = url.replace(/\/+$/, "");
    localStorage.setItem("utilities_api_base", API_BASE);

    const apiBaseInput = document.getElementById("apiBase");
    if (apiBaseInput) apiBaseInput.value = API_BASE;

    log("Базовый URL API обновлён", API_BASE);
}

export async function apiRequest(path, options = {}, requireAuth = true) {
    const url = API_BASE + path;
    const headers = options.headers || {};
    headers["Content-Type"] = "application/x-www-form-urlencoded";

    const token = localStorage.getItem("utilities_token");
    if (requireAuth && token) {
        headers["Authorization"] = "Bearer " + token;
    }

    const fetchOptions = {
        method: options.method || "GET",
        headers,
    };

    if (options.body !== undefined && options.body !== null) {
        fetchOptions.body = new URLSearchParams(options.body).toString();
    }

    log(`→ ${fetchOptions.method} ${url}`, options.body);

    const response = await fetch(url, fetchOptions);

    const text = await response.text();
    let data;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    if (!response.ok) {
        log(`Ошибка ${response.status} ${response.statusText}`, data);
        throw new Error(
            typeof data === "object" && data && data.err
                ? data.err
                : `HTTP ${response.status}`
        );
    }

    log(`Успешный ответ от ${path}`, data);
    return data;
}
