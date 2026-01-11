// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@vueform/nuxt"],
  app: {
    head: {
      title: "Vueform Plugin | Checkbox Select All",
      meta: [
        {
          name: "description",
          content:
            'This plugin enables complex "Select All" logic for Vueform. It handles bi-directional synchronization (Parent ↔ Child) and prevents infinite loops using an internal locking mechanism. It supports standard checkboxes, checkbox groups, and nested structures.',
        },
      ],
    },
  },
});
