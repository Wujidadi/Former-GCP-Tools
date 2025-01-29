import Decimal from 'decimal.js';

Decimal.set({ precision: 50 });

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.provide('decimal', Decimal);
});