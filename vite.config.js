import { defineConfig } from "vite";

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
});
