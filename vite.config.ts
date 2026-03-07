import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis",
    "process.env": {},
    "process.browser": true,
  },
  resolve: {
    alias: {
      stream: "stream-browserify",
      crypto: "crypto-browserify",
      util: "util",
    },
  },
  optimizeDeps: {
    include: ["buffer", "crypto-browserify", "stream-browserify", "util"],
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
})
