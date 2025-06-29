import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // すべてのネットワークインターフェースでリッスン
    port: 5173,      // ポート番号を明示的に指定
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});