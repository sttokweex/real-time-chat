import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      port: 3000,
      host: true,
      watch: {
        usePolling: true,
      },
      esbuild: {
        target: 'esnext',
        platform: 'browser',
      },
    },
    define: {
      VITE_DEV_PORT: JSON.stringify(
        env.VITE_DEV_PORT || 'http://localhost:3001',
      ),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // Используйте path.resolve для корректного разрешения
      },
    },
  };
});
