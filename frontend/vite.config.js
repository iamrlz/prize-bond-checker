// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: 'https://github.com/iamrlz/prize-bond-checker',  // 👈 This is required for GitHub Pages
  plugins: [react()],
});
