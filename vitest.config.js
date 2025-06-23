import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js', // crée ce fichier aussi si besoin
    include: ['**/*.test.jsx'], // ou .tsx si tu utilises TypeScript
  },
});
