import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import type { Request, Response } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '5mb' }));

// Persistent local JSON store for cross-device visitor alerts, leads, properties & settings
const DATA_DIR = path.join(__dirname, '.ptah-data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

interface StoreState {
  properties: unknown[] | null;
  leads: unknown[] | null;
  visitors: unknown[];
  settings: Record<string, unknown> | null;
}

function loadStore(): StoreState {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        properties: Array.isArray(parsed.properties) ? parsed.properties : null,
        leads: Array.isArray(parsed.leads) ? parsed.leads : null,
        visitors: Array.isArray(parsed.visitors) ? parsed.visitors : [],
        settings: parsed.settings && typeof parsed.settings === 'object' ? parsed.settings : null,
      };
    }
  } catch (err) {
    console.error('Error loading server store:', err);
  }
  return { properties: null, leads: null, visitors: [], settings: null };
}

function saveStore(state: StoreState): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving server store:', err);
  }
}

const store: StoreState = loadStore();

// Connected SSE owner clients for real-time notifications
const sseClients = new Set<Response>();

function broadcastEvent(eventName: string, payload: unknown): void {
  const data = `event: ${eventName}\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(data);
    } catch {
      sseClients.delete(client);
    }
  }
}

const COUNTRY_AR_MAP: Record<string, string> = {
  EG: 'مصر',
  SA: 'السعودية',
  AE: 'الإمارات',
  KW: 'الكويت',
  QA: 'قطر',
  BH: 'البحرين',
  OM: 'عُمان',
  JO: 'الأردن',
  LB: 'لبنان',
  IQ: 'العراق',
  SY: 'سوريا',
  PS: 'فلسطين',
  YE: 'اليمن',
  LY: 'ليبيا',
  TN: 'تونس',
  DZ: 'الجزائر',
  MA: 'المغرب',
  SD: 'السودان',
  US: 'الولايات المتحدة',
  GB: 'المملكة المتحدة',
  DE: 'ألمانيا',
  FR: 'فرنسا',
  IT: 'إيطاليا',
  ES: 'إسبانيا',
  TR: 'تركيا',
  CA: 'كندا',
  AU: 'أستراليا',
  RU: 'روسيا',
  CN: 'الصين',
  IN: 'الهند',
};

function codeToFlag(code: string): string {
  if (!code || code.length !== 2) return '🌍';
  const upper = code.toUpperCase();
  const offset = 127397;
  return String.fromCodePoint(...upper.split('').map((c) => c.charCodeAt(0) + offset));
}

function extractClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  const raw = Array.isArray(forwarded) ? forwarded[0] : (forwarded || req.socket.remoteAddress || '');
  const firstIp = raw.split(',')[0].trim().replace(/^::ffff:/, '');
  return firstIp;
}

function isPrivateOrLocalIp(ip: string): boolean {
  if (!ip) return true;
  if (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') return true;
  if (ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('fc') || ip.startsWith('fd')) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)) return true;
  return false;
}

async function resolveGeoFromIp(ip: string): Promise<{
  country: string;
  countryAr: string;
  countryCode: string;
  city: string;
  flag: string;
} | null> {
  if (isPrivateOrLocalIp(ip)) return null;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const resp = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!resp.ok) return null;
    const data = (await resp.json()) as {
      success?: boolean;
      country?: string;
      country_code?: string;
      city?: string;
    };
    if (!data || data.success === false || !data.country_code) return null;
    const cc = data.country_code.toUpperCase();
    return {
      country: data.country || cc,
      countryAr: COUNTRY_AR_MAP[cc] || data.country || 'غير معروف',
      countryCode: cc,
      city: data.city || '',
      flag: codeToFlag(cc),
    };
  } catch {
    return null;
  }
}

// --- API ROUTES ---

app.get('/api/state', (_req: Request, res: Response) => {
  res.json({
    properties: store.properties,
    leads: store.leads,
    visitors: store.visitors,
    settings: store.settings,
  });
});

app.get('/api/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  res.write(`event: connected\ndata: ${JSON.stringify({ ok: true, visitorsCount: store.visitors.length })}\n\n`);
  sseClients.add(res);

  const heartbeat = setInterval(() => {
    try {
      res.write(': keepalive\n\n');
    } catch {
      clearInterval(heartbeat);
      sseClients.delete(res);
    }
  }, 25000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
  });
});

app.get('/api/visitors', (_req: Request, res: Response) => {
  res.json(store.visitors);
});

app.post('/api/visitors', async (req: Request, res: Response) => {
  try {
    const incoming = (req.body || {}) as Record<string, unknown>;
    const clientIp = extractClientIp(req);
    const serverGeo = await resolveGeoFromIp(clientIp);

    const countryCode =
      serverGeo?.countryCode ||
      (typeof incoming.countryCode === 'string' && incoming.countryCode ? incoming.countryCode : 'EG');
    const country =
      serverGeo?.country ||
      (typeof incoming.country === 'string' && incoming.country ? incoming.country : 'Egypt');
    const countryAr =
      serverGeo?.countryAr ||
      (typeof incoming.countryAr === 'string' && incoming.countryAr
        ? incoming.countryAr
        : COUNTRY_AR_MAP[countryCode] || country);
    const city =
      serverGeo?.city ||
      (typeof incoming.city === 'string' ? incoming.city : '');
    const flag = serverGeo?.flag || (typeof incoming.flag === 'string' && incoming.flag ? incoming.flag : codeToFlag(countryCode));

    const visitorEntry = {
      id: typeof incoming.id === 'string' ? incoming.id : `vis-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp:
        typeof incoming.timestamp === 'string'
          ? incoming.timestamp
          : new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      page: typeof incoming.page === 'string' ? incoming.page : 'الرئيسية (Home)',
      device: incoming.device === 'mobile' || incoming.device === 'tablet' ? incoming.device : 'desktop',
      browser: typeof incoming.browser === 'string' ? incoming.browser : 'Browser',
      referrer: typeof incoming.referrer === 'string' ? incoming.referrer : 'مباشر (Direct)',
      country,
      countryAr,
      countryCode,
      city,
      flag,
    };

    store.visitors = [visitorEntry, ...store.visitors].slice(0, 150);
    saveStore(store);
    broadcastEvent('visitor', visitorEntry);

    res.status(201).json(visitorEntry);
  } catch (err) {
    console.error('Error recording visitor:', err);
    res.status(500).json({ error: 'Failed to log visitor' });
  }
});

app.delete('/api/visitors', (_req: Request, res: Response) => {
  store.visitors = [];
  saveStore(store);
  broadcastEvent('visitors_cleared', { ok: true });
  res.json({ ok: true });
});

app.get('/api/leads', (_req: Request, res: Response) => {
  res.json(store.leads || []);
});

app.post('/api/leads', (req: Request, res: Response) => {
  const lead = req.body;
  if (!lead || typeof lead !== 'object') {
    res.status(400).json({ error: 'Invalid lead payload' });
    return;
  }
  const existing = Array.isArray(store.leads) ? store.leads : [];
  store.leads = [lead, ...existing].slice(0, 200);
  saveStore(store);
  broadcastEvent('lead', lead);
  res.status(201).json(lead);
});

app.put('/api/leads', (req: Request, res: Response) => {
  if (!Array.isArray(req.body)) {
    res.status(400).json({ error: 'Expected array of leads' });
    return;
  }
  store.leads = req.body;
  saveStore(store);
  res.json({ ok: true });
});

app.put('/api/properties', (req: Request, res: Response) => {
  if (!Array.isArray(req.body)) {
    res.status(400).json({ error: 'Expected array of properties' });
    return;
  }
  store.properties = req.body;
  saveStore(store);
  res.json({ ok: true });
});

app.put('/api/settings', (req: Request, res: Response) => {
  if (!req.body || typeof req.body !== 'object') {
    res.status(400).json({ error: 'Expected settings object' });
    return;
  }
  store.settings = req.body as Record<string, unknown>;
  saveStore(store);
  res.json({ ok: true });
});

// --- DEDICATED BINARY ZIP DOWNLOAD ENDPOINTS ---
app.get(['/ptah-download.zip', '/ptah-website.zip', '/ptah-realestate-build.zip', '/download'], (req: Request, res: Response, next) => {
  const requestedName = req.path.endsWith('.zip') ? path.basename(req.path) : 'ptah-download.zip';
  const candidates = [
    path.resolve(__dirname, 'public', requestedName),
    path.resolve(__dirname, 'public', 'ptah-download.zip'),
    path.resolve(__dirname, 'public', 'ptah-website.zip'),
  ];
  const targetPath = candidates.find((p) => fs.existsSync(p));
  if (!targetPath) {
    next();
    return;
  }
  const stat = fs.statSync(targetPath);
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${path.basename(targetPath)}"`);
  res.setHeader('Content-Length', String(stat.size));
  fs.createReadStream(targetPath).pipe(res);
});

async function startServer(): Promise<void> {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.use(express.static(path.join(__dirname, 'public')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ptah Real Estate full-stack server running on http://0.0.0.0:${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer();
