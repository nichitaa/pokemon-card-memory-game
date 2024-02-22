import { createRoot } from 'react-dom/client';
import App from './app.tsx';
import './styles/global.css';
import { ThemeProvider } from '@/components/theme-provider.tsx';

const root = document.getElementById('root')!;
const app = (
  <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
    <App />
  </ThemeProvider>
);
createRoot(root).render(app);
