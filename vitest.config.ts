import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

const alias = {
  '@': path.resolve(__dirname, './src'),
  '@modules': path.resolve(__dirname, './src/modules'),
  '@components': path.resolve(__dirname, './src/components'),
  '@hooks': path.resolve(__dirname, './src/hooks'),
  '@utils': path.resolve(__dirname, './src/utils'),
  '@constants': path.resolve(__dirname, './src/constants'),
  '@types': path.resolve(__dirname, './src/types'),
  '@api': path.resolve(__dirname, './src/api'),
};

export default defineConfig({
  plugins: [react()],
  resolve: { alias },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'], // ← esto faltaba
  },
});
