// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Sin output específico - usa el default (static) para desarrollo
  // El endpoint API con prerender: false funcionará en modo dev
  vite: {
    plugins: [tailwindcss()]
  }
});