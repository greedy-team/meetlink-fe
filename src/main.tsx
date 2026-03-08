import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Toaster } from '@/components/ui/sonner';

import App from './App.tsx';

import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster
          richColors
          theme="light"
          position="bottom-center"
          duration={2000}
          offset={80}
          toastOptions={{
            className: 'rounded-2xl border-2',
            classNames: {
              toast: 'bg-white text-gray-900',
              title: 'text-lg font-bold',
              description: 'text-md text-gray-500',
              success: 'border-greedy bg-greedy/5 text-greedy',
              error: 'border-red-200 bg-red-50 text-red-600',
            },
          }}
        />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
