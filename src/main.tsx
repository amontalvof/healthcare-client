import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/sonner';
import App from './App.tsx';
import 'leaflet/dist/leaflet.css';
import './main.css';
import 'react-day-picker/dist/style.css';
import { TooltipProvider } from './components/ui/tooltip.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>
                    <App />
                </TooltipProvider>
                <Toaster position="bottom-right" />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>
);
