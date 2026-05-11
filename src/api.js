export const API_BASE = import.meta.env.DEV
    ? ""
    : (import.meta.env.VITE_BACKEND_ENDPOINT || "").replace(/\/+$/, "");

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

    console.log(`→ ${fetchOptions.method} ${url}`, options.body);

    const response = await fetch(url, fetchOptions);

    const text = await response.text();
    let data;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    if (!response.ok) {
        console.log(`Ошибка ${response.status} ${response.statusText}`, data);

        if (response.status === 401) {
            localStorage.removeItem("utilities_token");
            if (!window.location.pathname.endsWith("/index.html") &&
                window.location.pathname !== "/") {
                window.location.href = "/";
            }
        }

        throw new Error(
            typeof data === "object" && data && data.err
                ? data.err
                : `HTTP ${response.status}`
        );
    }

    console.log(`Успешный ответ от ${path}`, data);
    return data;
}
