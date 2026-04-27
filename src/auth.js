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

export function updateAuthUI() {
    const token = getToken();
    const statusEl = document.getElementById("authStatusText");
    const tokenEl  = document.getElementById("tokenPreview");
    const logoutBtn = document.getElementById("logoutBtn");

    if (!statusEl || !tokenEl || !logoutBtn) return;

    if (token) {
        statusEl.textContent = "авторизован";
        statusEl.classList.remove("bad");
        statusEl.classList.add("ok");
        tokenEl.textContent = token.length > 40 ? token.slice(0, 40) + "…" : token;
        logoutBtn.disabled = false;
    } else {
        statusEl.textContent = "не авторизован";
        statusEl.classList.remove("ok");
        statusEl.classList.add("bad");
        tokenEl.textContent = "—";
        logoutBtn.disabled = true;
    }
}
