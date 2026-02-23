import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type ProxyOptions } from 'vite'; // ProxyOptions 타입 추가

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // 서버 프록시 설정 추가
  server: {
    host: true,
    proxy: {
      // '/api'로 시작하는 요청을 대상 서버로 전달합니다.
      '/api': {
        target: 'https://api-dev.meetlink.now/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),

        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, _req, _res) => {
            // 외부 IP(172.x.x.x)로 접속해도 백엔드에게는 localhost에서 온 것처럼 속입니다.
            proxyReq.setHeader('Origin', 'http://localhost:5173');
          });
        },
      } as ProxyOptions,
    },
  },
});
