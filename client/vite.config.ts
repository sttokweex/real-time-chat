import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      port: 80,
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
  };
});
