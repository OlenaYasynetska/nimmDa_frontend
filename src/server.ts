import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { get as httpsGet } from 'node:https';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { POPULAR_CATEGORIES, categoryListingsPath } from './app/features/landing/data/landing.content';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const siteOrigin = 'https://www.nimmda.org';
const apiBase = (process.env['NG_APP_API_URL'] || 'https://api.nimmda.org/api').replace(/\/$/, '');
const extraHosts = (process.env['NG_ALLOWED_HOSTS'] || '')
  .split(',')
  .map((host) => host.trim())
  .filter((host) => host.length > 0);

const app = express();
const angularApp = new AngularNodeAppEngine({
  allowedHosts: ['www.nimmda.org', 'nimmda.org', 'localhost', '127.0.0.1', '*.vercel.app', ...extraHosts],
  trustProxyHeaders: true,
});

let sitemapCache: { xml: string; expires: number } | null = null;

app.get('/sitemap.xml', async (_req, res, next) => {
  try {
    const xml = await sitemapXml();
    res.type('application/xml').set('Cache-Control', 'public, max-age=600').send(xml);
  } catch (error) {
    next(error);
  }
});

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

if (isMainModule(import.meta.url)) {
  const port = Number(process.env['PORT'] || 4000);
  const host = process.env['HOST'] || '0.0.0.0';
  app.listen(port, host, () => {
    console.log(`NimmDa frontend listening on http://${host}:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);

interface PublishedListing {
  id?: string;
  category?: string;
  price?: number;
}

async function sitemapXml(): Promise<string> {
  const now = Date.now();
  if (sitemapCache && sitemapCache.expires > now) {
    return sitemapCache.xml;
  }
  const listings = await publishedListings();
  if (!listings) {
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteOrigin}/</loc></url>\n</urlset>\n`;
  }
  const paths = new Set<string>(['/', '/anzeigen', '/impressum', '/datenschutz', '/kontakt', '/ueber-uns']);
  const usedCategories = new Set(listings.map((item) => item.category).filter((name): name is string => !!name));
  for (const category of POPULAR_CATEGORIES) {
    if (category.slug === 'weitere' || !usedCategories.has(category.name)) {
      continue;
    }
    paths.add(categoryListingsPath(category));
  }
  if (listings.some((item) => Number(item.price) === 0)) {
    paths.add('/kostenlos');
  }
  for (const item of listings) {
    if (item.id) {
      paths.add(`/anzeigen/${item.id}`);
    }
  }
  const urls = [...paths]
    .map((path) => `  <url><loc>${siteOrigin}${path}</loc></url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  sitemapCache = { xml, expires: now + 10 * 60 * 1000 };
  return xml;
}

async function publishedListings(): Promise<PublishedListing[] | null> {
  const url = `${apiBase}/listings?page=0&size=100`;
  return new Promise((resolve) => {
    const request = httpsGet(
      url,
      { headers: { Accept: 'application/json', 'User-Agent': 'NimmDa/1.0 (https://nimmda.org)' } },
      (response) => {
        const chunks: Buffer[] = [];
        response.on('data', (chunk: Buffer) => chunks.push(chunk));
        response.on('end', () => {
          if (response.statusCode !== 200) {
            resolve(null);
            return;
          }
          try {
            const body = JSON.parse(Buffer.concat(chunks).toString('utf8')) as { content?: PublishedListing[] };
            resolve(body.content ?? []);
          } catch {
            resolve(null);
          }
        });
      }
    );
    request.on('error', () => resolve(null));
  });
}
