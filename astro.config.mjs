// @ts-check
import { defineConfig } from 'astro/config';
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  // Replace with your GitHub Pages URL
  site: 'https://HiroByteBit.github.io',
  // Replace with your repository name
  base: '/Portfolio',
  integrations: [icon()]
});
