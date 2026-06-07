import { initAuth } from "./auth-page.js";
import { initApp } from "./main.js";

let appInitialized = false;

function showSection(name) {
    const isAuth = name === "auth";
    document.body.classList.toggle("auth-page", isAuth);
    document.getElementById("section-auth").hidden = !isAuth;
    document.getElementById("section-app").hidden = isAuth;
}

window.__navigate = function (section) {
    if (section === "app" && !appInitialized) {
        appInitialized = true;
        initApp();
    }
    showSection(section);
};

document.addEventListener("DOMContentLoaded", () => {
    initAuth();
    const token = localStorage.getItem("utilities_token");
    window.__navigate(token ? "app" : "auth");
});
