import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Serve public directory assets as well (images, icons)
app.use(express.static(path.join(__dirname, 'public')));

// Fallback all routes to dist/index.html for React SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Ptah Real Estate production server running on http://0.0.0.0:${PORT}`);
});
