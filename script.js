// ===== ГЛОБАЛЬНЫЕ НАСТРОЙКИ =====

let API_BASE = "http://localhost:8080";
let authToken = null;

// ===== УТИЛИТЫ =====

function log(message, data) {
    const logOutput = document.getElementById("logOutput");
    if (!logOutput) return;
    
    const time = new Date().toLocaleTimeString();
    let line = `[${time}] ${message}`;
    if (data !== undefined) {
        try {
            line += "\n" + JSON.stringify(data, null, 2);
        } catch {
            line += "\n" + String(data);
        }
    }
    logOutput.textContent = line + "\n\n" + logOutput.textContent;
}

function updateAuthUI() {
    const statusEl = document.getElementById("authStatusText");
    const tokenEl = document.getElementById("tokenPreview");
    const logoutBtn = document.getElementById("logoutBtn");

    if (!statusEl || !tokenEl || !logoutBtn) return;

    if (authToken) {
        statusEl.textContent = "авторизован";
        statusEl.classList.remove("bad");
        statusEl.classList.add("ok");
        tokenEl.textContent =
            authToken.length > 40 ? authToken.slice(0, 40) + "…" : authToken;
        logoutBtn.disabled = false;
    } else {
        statusEl.textContent = "не авторизован";
        statusEl.classList.remove("ok");
        statusEl.classList.add("bad");
        tokenEl.textContent = "—";
        logoutBtn.disabled = true;
    }
}

function setToken(token) {
    authToken = token;
    if (token) {
        localStorage.setItem("utilities_token", token);
    } else {
        localStorage.removeItem("utilities_token");
    }
    updateAuthUI();
}

function setBaseUrl(url) {
    API_BASE = url.replace(/\/+$/, ""); // убрать хвостовые /
    localStorage.setItem("utilities_api_base", API_BASE);
    
    const apiBaseInput = document.getElementById("apiBase");
    if (apiBaseInput) {
        apiBaseInput.value = API_BASE;
    }
    
    log("Базовый URL API обновлён", API_BASE);
}

// Универсальная функция запроса к API
async function apiRequest(path, options = {}, requireAuth = true) {
    const url = API_BASE + path;
    const headers = options.headers || {};
    headers["Content-Type"] = "application/x-www-form-urlencoded";

    if (requireAuth && authToken) {
        headers["Authorization"] = "Bearer " + authToken;
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

// Рендер таблиц

function renderBillsTable(containerId, bills) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!bills || bills.length === 0) {
        container.innerHTML = '<p class="hint">Нет данных.</p>';
        return;
    }

    const rows = bills
        .map(
            (b) => `
        <tr>
            <td>${b.ID ?? b.id ?? ""}</td>
            <td>${b.Address ?? b.address ?? ""}</td>
            <td>${b.Amount ?? b.amount ?? ""}</td>
            <td>${b.UserID ?? b.user_id ?? ""}</td>
            <td>${b.DueDate ?? b.due_date ?? ""}</td>
        </tr>
    `
        )
        .join("");

    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Адрес</th>
                    <th>Сумма</th>
                    <th>ID пользователя</th>
                    <th>До даты</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
    `;
}

function renderUsersTable(containerId, users) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!users || users.length === 0) {
        container.innerHTML = '<p class="hint">Нет данных.</p>';
        return;
    }

    const rows = users
        .map(
            (u) => `
        <tr>
            <td>${u.ID ?? u.id ?? ""}</td>
            <td>${u.Email ?? u.email ?? ""}</td>
            <td>${u.IsAdmin ?? u.is_admin ? "Да" : "Нет"}</td>
        </tr>
    `
        )
        .join("");

    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Админ</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
    `;
}

// ===== ОБРАБОТЧИКИ ФОРМ =====

document.addEventListener("DOMContentLoaded", () => {
    // восстановить базовый URL
    const savedBase = localStorage.getItem("utilities_api_base");
    if (savedBase) {
        API_BASE = savedBase;
        const apiBaseInput = document.getElementById("apiBase");
        if (apiBaseInput) {
            apiBaseInput.value = savedBase;
        }
    }

    // восстановить токен
    const savedToken = localStorage.getItem("utilities_token");
    if (savedToken) {
        authToken = savedToken;
    }
    updateAuthUI();

    // смена базового URL
    const saveBaseUrlBtn = document.getElementById("saveBaseUrl");
    if (saveBaseUrlBtn) {
        saveBaseUrlBtn.addEventListener("click", () => {
            const apiBaseInput = document.getElementById("apiBase");
            if (!apiBaseInput) return;
            
            const url = apiBaseInput.value.trim();
            if (!url) return;
            setBaseUrl(url);
        });
    }

    // регистрация
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const form = e.target;
            const email = form.email.value.trim();
            const password = form.password.value;

            try {
                const data = await apiRequest(
                    "/users/register",
                    {
                        method: "POST",
                        body: { email, password },
                    },
                    false
                );

                alert(
                    `Пользователь зарегистрирован. ID: ${data.id ?? data.ID ?? "неизвестен"
                    }`
                );
            } catch (err) {
                alert("Ошибка регистрации: " + err.message);
            }
        });
    }

    // вход
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const form = e.target;
            const email = form.email.value.trim();
            const password = form.password.value;

            try {
                const data = await apiRequest(
                    "/users/login",
                    {
                        method: "POST",
                        body: { email, password },
                    },
                    false
                );

                const token = data.token || data.Token;
                if (!token) {
                    throw new Error("В ответе нет поля token");
                }

                setToken(token);
                alert("Успешный вход в систему.");
            } catch (err) {
                alert("Ошибка входа: " + err.message);
            }
        });
    }

    // выход
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            if (!authToken) return;

            try {
                await apiRequest(
                    "/users/logout",
                    {
                        method: "POST",
                        body: {},
                    },
                    true
                );

                setToken(null);
                alert("Вы вышли из системы.");
            } catch (err) {
                alert("Ошибка выхода: " + err.message);
            }
        });
    }

    // получить все счета текущего пользователя
    const loadBillsBtn = document.getElementById("loadBillsBtn");
    if (loadBillsBtn) {
        loadBillsBtn.addEventListener("click", async () => {
            try {
                const data = await apiRequest("/bills", {}, true);
                const bills = Array.isArray(data.bills) ? data.bills : [data.bills];
                renderBillsTable("billsList", bills);
            } catch (err) {
                alert("Ошибка загрузки счетов: " + err.message);
            }
        });
    }

    // получить конкретный счёт по ID
    const getBillForm = document.getElementById("getBillForm");
    if (getBillForm) {
        getBillForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const id = e.target.id.value;

            try {
                const data = await apiRequest(`/bills/${id}`, {}, true);
                const bills = Array.isArray(data) ? data : [data];
                renderBillsTable("singleBill", bills);
            } catch (err) {
                alert("Ошибка получения счёта: " + err.message);
            }
        });
    }

    // оплатить счёт
    const payBillForm = document.getElementById("payBillForm");
    if (payBillForm) {
        payBillForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const id = Number(e.target.id.value);

            try {
                await apiRequest(
                    "/bills/pay",
                    {
                        method: "POST",
                        body: { id },
                    },
                    true
                );
                alert("Счёт оплачен");
            } catch (err) {
                alert("Ошибка оплаты: " + err.message);
            }
        });
    }

    // админ: создать счёт
    const createBillForm = document.getElementById("createBillForm");
    if (createBillForm) {
        createBillForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const form = e.target;

            const address = form.address.value.trim();
            const amount = Number(form.amount.value);
            const user_id = Number(form.user_id.value);

            try {
                const data = await apiRequest(
                    "/admin/bills",
                    {
                        method: "POST",
                        body: { address, amount, user_id },
                    },
                    true
                );
                alert("Счёт создан. ID: " + (data.id ?? data.ID ?? "неизвестен"));
            } catch (err) {
                alert("Ошибка создания счёта: " + err.message);
            }
        });
    }

    // админ: список пользователей
    const loadUsersBtn = document.getElementById("loadUsersBtn");
    if (loadUsersBtn) {
        loadUsersBtn.addEventListener("click", async () => {
            try {
                const data = await apiRequest("/admin/users", {}, true);
                const users = Array.isArray(data) ? data : [data];
                renderUsersTable("usersList", users);
            } catch (err) {
                alert("Ошибка загрузки пользователей: " + err.message);
            }
        });
    }

    // очистка лога
    const clearLogBtn = document.getElementById("clearLogBtn");
    if (clearLogBtn) {
        clearLogBtn.addEventListener("click", () => {
            const logOutput = document.getElementById("logOutput");
            if (logOutput) {
                logOutput.textContent = "";
            }
        });
    }
});
