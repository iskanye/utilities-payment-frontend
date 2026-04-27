import { initRouter } from "./router.js";
import { initCommon } from "./common.js";
import { apiRequest } from "./api.js";
import { setToken } from "./auth.js";
import { renderBillsTable, renderUsersTable } from "./render.js";

document.addEventListener("DOMContentLoaded", () => {
    initRouter();
    initCommon();

    // ===== AUTH =====

    document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const { email, password } = e.target;
        try {
            const data = await apiRequest(
                "/users/register",
                { method: "POST", body: { email: email.value.trim(), password: password.value } },
                false
            );
            alert(`Пользователь зарегистрирован. ID: ${data.id ?? data.ID ?? "неизвестен"}`);
        } catch (err) {
            alert("Ошибка регистрации: " + err.message);
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
            alert("Успешный вход в систему.");
        } catch (err) {
            alert("Ошибка входа: " + err.message);
        }
    });

    // ===== BILLS =====

    document.getElementById("loadBillsBtn")?.addEventListener("click", async () => {
        try {
            const data = await apiRequest("/bills", {}, true);
            const bills = Array.isArray(data.bills) ? data.bills : [data.bills];
            renderBillsTable("billsList", bills);
        } catch (err) {
            alert("Ошибка загрузки счетов: " + err.message);
        }
    });

    document.getElementById("getBillForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = e.target.id.value;
        try {
            const data = await apiRequest(`/bills/${id}`, {}, true);
            renderBillsTable("singleBill", Array.isArray(data) ? data : [data]);
        } catch (err) {
            alert("Ошибка получения счёта: " + err.message);
        }
    });

    document.getElementById("payBillForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = Number(e.target.id.value);
        try {
            await apiRequest("/bills/pay", { method: "POST", body: { id } }, true);
            alert("Счёт оплачен");
        } catch (err) {
            alert("Ошибка оплаты: " + err.message);
        }
    });

    // ===== ADMIN =====

    document.getElementById("createBillForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const { address, amount, user_id } = e.target;
        try {
            const data = await apiRequest(
                "/admin/bills",
                {
                    method: "POST",
                    body: {
                        address: address.value.trim(),
                        amount: Number(amount.value),
                        user_id: Number(user_id.value),
                    },
                },
                true
            );
            alert("Счёт создан. ID: " + (data.id ?? data.ID ?? "неизвестен"));
        } catch (err) {
            alert("Ошибка создания счёта: " + err.message);
        }
    });

    document.getElementById("loadUsersBtn")?.addEventListener("click", async () => {
        try {
            const data = await apiRequest("/admin/users", {}, true);
            renderUsersTable("usersList", Array.isArray(data) ? data : [data]);
        } catch (err) {
            alert("Ошибка загрузки пользователей: " + err.message);
        }
    });
});
