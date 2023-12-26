import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react-swc";
// import viteCompression from "vite-plugin-compression";
import { manifest } from "./pwa/manifest";

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        // outDir: "dist",
        // outDir:"public",
        // chunkSizeWarningLimit:"2000",
        reportCompressedSize: false,
    },
    // appType: "spa",
    server: {
        port: 3040,
        // fs: {
        //     deny: ["dist/"],
        // },
    },
    plugins: [
        react(),
        VitePWA({
            strategies: "injectManifest",
            srcDir: "src",
            filename: "sw.js",
            injectRegister: null,
            manifest: manifest,
        }),
    ],
});

// new injectManifest({
//     // dontCacheBustURLsMatching:["**/*sw.js"],
//     globDirectory: "dist/",
//     globPatterns: [
//         "**/*.{js,css,PNG,otf,ttf,html,svg,jpg,png,webp,gif}",
//     ],
//     globStrict: true,
//     globIgnores: ["**/node_modules/**/*"],
//     swSrc: "./src/swSrc.js",
//     swDest: "./dist/sw.js",
// }),
// viteCompression({
//     algorithm: "brotliCompress",
//     ext: ".br",
// }),
