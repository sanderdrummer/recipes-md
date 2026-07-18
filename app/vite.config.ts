import { fileURLToPath } from "node:url";
import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// recipes/ lives at the repo root, one level above this app/ folder.
const repoRoot = fileURLToPath(new URL("..", import.meta.url));

export default defineConfig(({ mode }) => ({
  base: "/recipes-md/",
  plugins: [
    // Self-signed HTTPS for LAN testing (`npm run dev:lan`): getUserMedia on
    // iOS requires a secure context, plain http://<lan-ip> won't do.
    ...(mode === "lan" ? [basicSsl()] : []),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "Rezepte",
        short_name: "Rezepte",
        description: "Meine Rezeptsammlung – offline verfügbar",
        lang: "de",
        start_url: "/recipes-md/",
        scope: "/recipes-md/",
        display: "standalone",
        background_color: "#090b14",
        theme_color: "#090b14",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  server: {
    // Allow importing the recipe markdown files from the repo root.
    fs: { allow: [repoRoot] },
  },
}));
