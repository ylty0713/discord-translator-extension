import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(rootDir, "popup/popup.html"),
        background: resolve(rootDir, "background/background.ts"),
        content: resolve(rootDir, "content/content.ts")
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "background") {
            return "background/[name].js";
          }

          if (chunkInfo.name === "content") {
            return "content/[name].js";
          }

          return "assets/[name].js";
        },
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name ?? "";

          if (name.endsWith(".css")) {
            if (name.includes("popup")) {
              return "popup/[name].[ext]";
            }

            return "content/[name].[ext]";
          }

          return "assets/[name].[ext]";
        }
      }
    }
  }
});
