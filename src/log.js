export function log(message, data) {
    if (data !== undefined) {
        console.log(message, data);
    } else {
        console.log(message);
    }
}
