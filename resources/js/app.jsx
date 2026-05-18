import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@/Components/ThemeProvider';
import { Toaster } from 'sonner';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.{jsx,tsx}');
        return resolvePageComponent(`./Pages/${name}.jsx`, pages).catch(() => resolvePageComponent(`./Pages/${name}.tsx`, pages));
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme" attribute="class" enableSystem>
                <App {...props} />
                <Toaster richColors position="bottom-right" />
            </ThemeProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
