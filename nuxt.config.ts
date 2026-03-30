import { resolve } from "path";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },

  alias: {
    "@": resolve(__dirname, ""),
  },
  ssr: false,
  css: ["@/assets/css/style.scss"],
  modules: [
    "@nuxtjs/tailwindcss",
    "@ant-design-vue/nuxt",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
  ],

  app: {
    head: {
      link: [{ rel: "icon", type: "image/png", href: "/fav.png" }],
    },
  },

  vite: {
    build: {
      // Split vendor chunks for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            "ant-design": ["ant-design-vue"],
            swiper: ["swiper"],
          },
        },
      },
      // Reduce chunk size warnings threshold
      chunkSizeWarningLimit: 1000,
    },
  },

  experimental: {
    // Tree-shake payload for smaller client bundle
    payloadExtraction: true,
  },
});
