// plugins/pinia-persistedstate.js

import { defineNuxtPlugin } from "#app";
import piniaPersistedstate from "pinia-plugin-persistedstate";

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = nuxtApp.$pinia;
  pinia.use(piniaPersistedstate);
});
