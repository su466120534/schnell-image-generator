import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",  // 使用相对路径
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
