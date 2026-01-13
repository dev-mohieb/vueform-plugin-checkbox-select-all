import en from "@vueform/vueform/locales/en";
import vueform from "@vueform/vueform/dist/vueform";
import { defineConfig } from "@vueform/vueform";

import "@vueform/vueform/dist/vueform.css";

// Import custom plugin from the NPM package
// Source code at /vueform/plugins/CheckboxSelectAll.js
import CheckboxSelectAll from "vueform-plugin-checkbox-select-all";

export default defineConfig({
  theme: vueform,
  locales: { en },
  locale: "en",
  plugins: [CheckboxSelectAll],
});
