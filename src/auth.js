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
        window.location.href = "/";
        return false;
    }
    return true;
}

export function updateAuthUI() {
    const token = getToken();
    const statusEl = document.getElementById("authStatusText");
    const logoutBtn = document.getElementById("logoutBtn");

    if (!statusEl || !logoutBtn) return;

    if (token) {
        statusEl.textContent = "авторизован";
        statusEl.classList.remove("bad");
        statusEl.classList.add("ok");
        logoutBtn.disabled = false;
    } else {
        statusEl.textContent = "не авторизован";
        statusEl.classList.remove("ok");
        statusEl.classList.add("bad");
        logoutBtn.disabled = true;
    }
}
