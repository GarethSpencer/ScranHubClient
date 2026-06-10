import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
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
