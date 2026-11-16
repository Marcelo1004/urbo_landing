import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { getInstagramFeed } from './server/instagramFeed.js'

function instagramApiPlugin() {
  return {
    name: 'instagram-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/api/instagram/feed')) {
          try {
            const feed = await getInstagramFeed();
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'public, max-age=600');
            res.end(JSON.stringify(feed));
            return;
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message }));
            return;
          }
        }
        if (req.url === '/api/health') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status: 'ok', env: 'vite-dev' }));
          return;
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/api/instagram/feed')) {
          try {
            const feed = await getInstagramFeed();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(feed));
            return;
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message }));
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), instagramApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-maplibre': ['maplibre-gl'],
          'vendor-gsap': ['gsap', 'gsap/ScrollTrigger'],
          'vendor-react': ['react', 'react-dom'],
        },
      },
    },
  },
})
