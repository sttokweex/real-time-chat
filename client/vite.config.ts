import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig,} from 'vite';

export default defineConfig(() => {

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // Используйте path.resolve для корректного разрешения
      },
    },
  };
});
