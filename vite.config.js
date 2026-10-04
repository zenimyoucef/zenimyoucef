import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/zenimyoucef/",
  plugins: [react()],
  server: { watch: { ignored: ["**/docs/**", "**/artifacts/**"] } },
  build: { target: "es2022", sourcemap: false },
});
