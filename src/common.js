import { updateAuthUI, setToken, getToken } from "./auth.js";
import { apiRequest } from "./api.js";

export function initCommon() {
    updateAuthUI();

    document.getElementById("logoutBtn")?.addEventListener("click", async () => {
        if (!getToken()) return;
        try {
            await apiRequest("/users/logout", { method: "POST", body: {} }, true);
            setToken(null);
            alert("Вы вышли из системы.");
        } catch (err) {
            alert("Ошибка выхода: " + err.message);
        }
    });

    document.getElementById("clearLogBtn")?.addEventListener("click", () => {
        const logOutput = document.getElementById("logOutput");
        if (logOutput) logOutput.textContent = "";
    });
}
