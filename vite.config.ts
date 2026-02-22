import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // 서버 프록시 설정 추가
  server: {
    proxy: {
      // '/api'로 시작하는 요청을 대상 서버로 전달합니다.
      '/api': {
        target: 'https://dev.meetlink.now',
        changeOrigin: true,
        // 주소에 이미 /api가 포함되어 있으므로 rewrite는 생략하거나
        // 서버 구성에 따라 필요시 추가합니다.
      },
    },
  },
});
