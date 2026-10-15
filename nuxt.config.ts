// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  app: {
    pageTransition: false,
    layoutTransition: false,
    head: {
      title: 'Gabor Patch',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
      script: [
        {
          // Pages are prerendered in the light theme; add the dark class before the first paint
          // so a dark-mode user does not see a light flash before the settings plugin runs.
          innerHTML: "try{if(JSON.parse(localStorage.getItem('gabor_settings')||'{}').isDarkMode)document.documentElement.classList.add('dark')}catch(e){}",
          tagPosition: 'head',
        },
      ],
    },
  },
  modules: ['@nuxt/icon', '@nuxt/fonts', '@nuxtjs/supabase'],
  supabase: {
    redirect: false,
    // The module default is 8 hours, which signs users out if they skip a day.
    // 400 days is the longest lifetime browsers accept; the cookie is renewed on every token refresh.
    cookieOptions: {
      maxAge: 60 * 60 * 24 * 400
    }
  },
  fonts: {
    families: [
      { name: 'Noto Sans TC', provider: 'google', weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] }
    ],
  },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },
});
