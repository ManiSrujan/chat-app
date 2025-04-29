import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  html: {
    template: "public/index.html",
  },
  server: {
    port: 4000,
  },
  plugins: [pluginReact()],
});
