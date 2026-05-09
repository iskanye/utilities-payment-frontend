import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  server: {
    port: 5500,
    proxy: {
      "^/(users|bills|admin|ping)": {
        target: "http://localhost:8080",
        bypass(req) {
          if (req.url?.endsWith(".html")) return req.url;
        },
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        auth: resolve(process.cwd(), "index.html"),
        app: resolve(process.cwd(), "app.html"),
      },
    },
  },
});
