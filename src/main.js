import { initRouter } from "./router.js";
import { initCommon } from "./common.js";
import { apiRequest } from "./api.js";
import { requireAuth } from "./auth.js";
import { renderBillsTable, renderUsersTable } from "./render.js";
import { toastSuccess, toastError } from "./toast.js";

document.addEventListener("DOMContentLoaded", () => {
    if (!requireAuth()) return;

    initRouter();
    initCommon();

    // ===== BILLS =====

    const clearContainer = (id) => {
        const el = document.querySelector(`#${id}`);
        if (el) el.innerHTML = "";
    };

    const loadBills = async () => {
        const data = await apiRequest("/bills", {}, true);
        const bills = Array.isArray(data.bills) ? data.bills : [data.bills];
        renderBillsTable("billsList", bills);
    };

    document.querySelector("#loadBillsBtn")?.addEventListener("click", async () => {
        clearContainer("singleBill");
        try {
            await loadBills();
        } catch (err) {
            toastError("Ошибка загрузки счетов: " + err.message);
        }
    });

    document.querySelector("#getBillForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = e.target.id.value;
        try {
            const data = await apiRequest(`/bills/${id}`, {}, true);
            renderBillsTable("singleBill", Array.isArray(data) ? data : [data]);
        } catch (err) {
            toastError("Ошибка получения счёта: " + err.message);
        }
    });

    document.querySelector("#payBillForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = Number(e.target.id.value);
        try {
            await apiRequest("/bills/pay", { method: "POST", body: { id } }, true);
            toastSuccess("Счёт оплачен");
            clearContainer("singleBill");
            try {
                await loadBills();
            } catch (err) {
                toastError("Ошибка обновления счетов: " + err.message);
            }
        } catch (err) {
            toastError("Ошибка оплаты: " + err.message);
        }
    });

    // ===== ADMIN =====

    document.querySelector("#createBillForm")?.addEventListener("submit", async (e) => {
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
            toastSuccess("Счёт создан. ID: " + (data.id ?? data.ID ?? "неизвестен"));
        } catch (err) {
            toastError("Ошибка создания счёта: " + err.message);
        }
    });

    document.querySelector("#loadUsersBtn")?.addEventListener("click", async () => {
        try {
            const data = await apiRequest("/admin/users", {}, true);
            renderUsersTable("usersList", Array.isArray(data) ? data : [data]);
        } catch (err) {
            toastError("Ошибка загрузки пользователей: " + err.message);
        }
    });
});
