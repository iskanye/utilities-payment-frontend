import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backend = env.VITE_BACKEND_ENDPOINT || "http://localhost:8080";

  return {
    root: ".",
    base: "./",
    server: {
      port: 5500,
      proxy: {
        "^/(users|bills|admin|ping)": {
          target: backend,
          changeOrigin: true,
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
  };
});
