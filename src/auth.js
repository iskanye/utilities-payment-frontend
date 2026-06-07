export function getToken() {
    return localStorage.getItem("utilities_token");
}

export function setToken(token) {
    if (token) {
        localStorage.setItem("utilities_token", token);
    } else {
        localStorage.removeItem("utilities_token");
    }
    updateAuthUI();
}

export function requireAuth() {
    if (!getToken()) {
        window.__navigate?.("auth");
        return false;
    }
    return true;
}

export function updateAuthUI() {
    const token = getToken();
    const statusEl = document.querySelector("#authStatusText");
    const logoutBtn = document.querySelector("#logoutBtn");

    if (!statusEl || !logoutBtn) return;

    if (token) {
        statusEl.textContent = "авторизован";
        statusEl.classList.remove("auth-status__text--unauthorized");
        statusEl.classList.add("auth-status__text--authorized");
        logoutBtn.disabled = false;
    } else {
        statusEl.textContent = "не авторизован";
        statusEl.classList.remove("auth-status__text--authorized");
        statusEl.classList.add("auth-status__text--unauthorized");
        logoutBtn.disabled = true;
    }
}
