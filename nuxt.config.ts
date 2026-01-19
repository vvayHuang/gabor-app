// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxt/icon', '@nuxtjs/google-fonts'],
  googleFonts: {
    families: {
      'Noto Sans TC': [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
    display: 'swap',
  },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },
});
