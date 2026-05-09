const PAGES = ["bills", "admin"];

function navigate() {
    const hash = window.location.hash.slice(1);
    const page = PAGES.includes(hash) ? hash : "bills";

    PAGES.forEach((p) => {
        const el = document.getElementById(`page-${p}`);
        if (el) el.hidden = p !== page;
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
        const linkPage = link.getAttribute("href")?.slice(1);
        link.classList.toggle("active", linkPage === page);
    });
}

export function initRouter() {
    if (!window.location.hash) {
        window.location.hash = "#bills";
    }
    navigate();
    window.addEventListener("hashchange", navigate);
}
