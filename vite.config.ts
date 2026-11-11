import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'zip-downloader-middleware',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const rawUrl = req.url ? req.url.split('?')[0] : '';
            if (rawUrl.endsWith('.zip') || rawUrl === '/download') {
              const filename = rawUrl.endsWith('.zip') ? path.basename(rawUrl) : 'ptah-website.zip';
              const filePath = path.resolve(__dirname, 'public', filename);
              const fallbackPath = path.resolve(__dirname, 'public', 'ptah-website.zip');
              const targetPath = fs.existsSync(filePath) ? filePath : (fs.existsSync(fallbackPath) ? fallbackPath : null);

              if (targetPath) {
                res.setHeader('Content-Type', 'application/zip');
                res.setHeader('Content-Disposition', `attachment; filename="${path.basename(targetPath)}"`);
                const stat = fs.statSync(targetPath);
                res.setHeader('Content-Length', stat.size);
                fs.createReadStream(targetPath).pipe(res);
                return;
              }
            }
            next();
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      allowedHosts: true,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
