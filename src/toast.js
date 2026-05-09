let container;

function ensureContainer() {
    if (container && document.body.contains(container)) return container;
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
    return container;
}

function show(message, type) {
    const root = ensureContainer();
    const el = document.createElement("div");
    el.className = `toast toast-${type}`;
    el.textContent = message;
    root.appendChild(el);

    requestAnimationFrame(() => el.classList.add("toast-visible"));

    const remove = () => {
        el.classList.remove("toast-visible");
        el.addEventListener("transitionend", () => el.remove(), { once: true });
    };

    const timer = setTimeout(remove, 4000);
    el.addEventListener("click", () => {
        clearTimeout(timer);
        remove();
    });
}

export function toastSuccess(message) {
    show(message, "success");
}

export function toastError(message) {
    show(message, "error");
}

export function toastInfo(message) {
    show(message, "info");
}
