import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.svg",
        "favicon.png",
        "favicon.ico",
        "apple-touch-icon.png",
      ],
      manifest: {
        name: "ScranHub",
        short_name: "ScranHub",
        description:
          "Plan and rate your scranning adventures with your friends! Form a group, rate everywhere you eat together and see what comes out on top.",
        theme_color: "#ad4242",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff,woff2}"],
      },
    }),
  ],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "react-bootstrap",
              test: /[\\/]node_modules[\\/](react-bootstrap|bootstrap)[\\/]/,
            },
            {
              name: "auth0",
              test: /[\\/]node_modules[\\/]@auth0[\\/]/,
            },
            {
              name: "react",
              test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/,
            },
            {
              name: "react-query",
              test: /[\\/]node_modules[\\/]@tanstack[\\/]/,
            },
            {
              name: "dnd-kit",
              test: /[\\/]node_modules[\\/]@dnd-kit[\\/]/,
            },
            {
              // Exclude emoji-picker-react so it stays in its own async
              // chunk (loaded on demand via React.lazy) instead of being
              // pulled into the eager vendor bundle.
              name: "vendor",
              test: /[\\/]node_modules[\\/](?!emoji-picker-react[\\/])/,
            },
          ],
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Bootstrap 5's SCSS still uses syntax Dart Sass is deprecating
        // ahead of removal in Sass 3.0. Silence until Bootstrap 6 migrates.
        silenceDeprecations: [
          "import",
          "if-function",
          "color-functions",
          "global-builtin",
        ],
      },
    },
  },
});
