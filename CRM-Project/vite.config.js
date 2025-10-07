import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // Automatically update service worker
      workbox: {
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024, // 6 MB (6,291,456 bytes)
      },
      manifest: {
        name: "NEXTGENOVE8",
        short_name: "GENOVE8",
        description: "My amazing PWA built with React and Vite",
        theme_color: "red",
        icons: [
          {
            src: "/assets/favicon-logo/logo-icon.svg",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/assets/favicon-logo/logo-icon.svg",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  // server: {
  //   host: true,
  //   port: 5173
  // }
});
