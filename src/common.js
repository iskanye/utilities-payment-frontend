import { updateAuthUI, setToken, getToken } from "./auth.js";
import { apiRequest } from "./api.js";

export function initCommon() {
    updateAuthUI();

    document.getElementById("logoutBtn")?.addEventListener("click", async () => {
        if (!getToken()) return;
        try {
            await apiRequest("/users/logout", { method: "POST", body: {} }, true);
        } catch (err) {
            console.warn("Ошибка выхода:", err.message);
        }
        setToken(null);
        window.location.href = "/";
    });
}
