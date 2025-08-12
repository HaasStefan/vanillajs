// vite.config.ts
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "src/**/*.css",
          dest: ".", // copy into dist keeping full src/... structure
          transform: (filePath) => {
            console.log("Copying CSS file:", filePath);
            // Keep relative path from "src"
            return filePath.replace(/^src[\\/]/, "");
          },
        },
      ],
    }),
  ],
  build: {
    cssCodeSplit: true, // stops Vite from smashing all CSS into one file
    rollupOptions: {
      output: {
        assetFileNames: "[name][extname]", // no hash
        chunkFileNames: "[name].js",
        entryFileNames: "[name].js",
      },
    },
  },
});
