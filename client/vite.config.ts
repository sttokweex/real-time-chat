import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      port: +env.VITE_CLIENT_PORT,
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
      VITE_SERVER_PORT: JSON.stringify(env.VITE_SERVER_PORT),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // Используйте path.resolve для корректного разрешения
      },
    },
  };
});
