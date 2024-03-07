import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react-swc";
// import viteCompression from "vite-plugin-compression";
import { manifest } from "./pwa/manifest";

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
    // appType:"mpa",
    build: {
        outDir: "../garage_server_v2/dist",
        emptyOutDir:true,
        // outDir:"public",
        // chunkSizeWarningLimit:"2000",
        reportCompressedSize: false,
        // rollupOptions:{}
    },
    // appType: "spa",
    server: {
        port: 3040,
        https: {
            key: "../garage_server_v2/cert/cert_nov2023_daniel/server.key",
            cert: "../garage_server_v2/cert/cert_nov2023_daniel/server.crt",
        },
        proxy: {
            "^/(api|files)/.*": {
                secure: false,
                changeOrigin: true,
                target: "https://localhost",
            },
        },
        // fs: {
        //     deny: ["dist/"],
        // },
    },
    plugins: [
        react(),
        VitePWA({
            strategies: "injectManifest",
            srcDir: "src",
            outDir:"../garage_server_v2/dist",
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
