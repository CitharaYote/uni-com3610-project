import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";

export default defineConfig({
  server: {
    port: parseInt(process.env.BACKEND_PORT!),
  },
  plugins: [
    ...VitePluginNode({
      adapter: "express",
      appPath: "./src/index.ts",
      exportName: "backend",
      tsCompiler: "esbuild",
      swcOptions: {},
      initAppOnBoot: true,
    }),
  ],
  build: {
    commonjsOptions: { transformMixedEsModules: true }, // Change
  },
});
