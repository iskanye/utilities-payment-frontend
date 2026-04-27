export function renderBillsTable(containerId, bills) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!bills || bills.length === 0) {
        container.innerHTML = '<p class="hint">Нет данных.</p>';
        return;
    }

    const rows = bills.map((b) => `
        <tr>
            <td>${b.ID       ?? b.id       ?? ""}</td>
            <td>${b.Address  ?? b.address  ?? ""}</td>
            <td>${b.Amount   ?? b.amount   ?? ""}</td>
            <td>${b.UserID   ?? b.user_id  ?? ""}</td>
            <td>${b.DueDate  ?? b.due_date ?? ""}</td>
        </tr>
    `).join("");

    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th><th>Адрес</th><th>Сумма</th>
                    <th>ID пользователя</th><th>До даты</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}

export function renderUsersTable(containerId, users) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!users || users.length === 0) {
        container.innerHTML = '<p class="hint">Нет данных.</p>';
        return;
    }

    const rows = users.map((u) => `
        <tr>
            <td>${u.ID    ?? u.id    ?? ""}</td>
            <td>${u.Email ?? u.email ?? ""}</td>
            <td>${(u.IsAdmin ?? u.is_admin) ? "Да" : "Нет"}</td>
        </tr>
    `).join("");

    container.innerHTML = `
        <table>
            <thead>
                <tr><th>ID</th><th>Email</th><th>Админ</th></tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}
