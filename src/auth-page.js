import { apiRequest } from "./api.js";
import { toastError } from "./toast.js";

function getToken() {
    return localStorage.getItem("utilities_token");
}

function setToken(token) {
    localStorage.setItem("utilities_token", token);
}

function goToApp() {
    window.location.href = "/app.html";
}

document.addEventListener("DOMContentLoaded", () => {
    if (getToken()) {
        goToApp();
        return;
    }

    const tabs = document.querySelectorAll(".auth-tab");
    const forms = document.querySelectorAll(".auth-form");
    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const target = tab.dataset.tab;
            tabs.forEach((t) => t.classList.toggle("active", t === tab));
            forms.forEach((f) => {
                f.hidden = f.dataset.form !== target;
            });
        });
    });

    document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const { email, password } = e.target;
        const credentials = { email: email.value.trim(), password: password.value };
        try {
            await apiRequest(
                "/users/register",
                { method: "POST", body: credentials },
                false
            );
            const loginData = await apiRequest(
                "/users/login",
                { method: "POST", body: credentials },
                false
            );
            const token = loginData.token || loginData.Token;
            if (!token) throw new Error("В ответе нет поля token");
            setToken(token);
            goToApp();
        } catch (err) {
            toastError("Ошибка регистрации: " + err.message);
        }
    });

    document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const { email, password } = e.target;
        try {
            const data = await apiRequest(
                "/users/login",
                { method: "POST", body: { email: email.value.trim(), password: password.value } },
                false
            );
            const token = data.token || data.Token;
            if (!token) throw new Error("В ответе нет поля token");
            setToken(token);
            goToApp();
        } catch (err) {
            toastError("Ошибка входа: " + err.message);
        }
    });
});
