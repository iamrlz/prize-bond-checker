import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/prize-bond-checker/',
  plugins: [react()],
});
