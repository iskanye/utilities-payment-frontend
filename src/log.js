export function log(message, data) {
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
