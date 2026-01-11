import en from "@vueform/vueform/locales/en";
import vueform from "@vueform/vueform/dist/vueform";
import { defineConfig } from "@vueform/vueform";

import "@vueform/vueform/dist/vueform.css";

// Import custom plugins
import CheckboxSelectAll from "./vueform/plugins/CheckboxSelectAll";

export default defineConfig({
  theme: vueform,
  locales: { en },
  locale: "en",
  plugins: [CheckboxSelectAll],
});
