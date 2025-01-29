// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Former GCP toolkit - Wujidadi',
      link: [
        {
          rel: 'icon',
          type: 'image/webp',
          href: '/favicon.webp',
        },
      ],
    },
  },
  modules: [
    '@unocss/nuxt',
  ],
  css: [
    "@/assets/styles/global.scss",
  ],
  unocss: {
    nuxtLayers: true,
  },
  plugins: [
    '~/plugins/decimal',
    '~/plugins/globalMethods',
    '~/plugins/guid',
  ],
});
