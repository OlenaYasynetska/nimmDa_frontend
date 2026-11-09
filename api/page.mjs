import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

const serverModule = pathToFileURL(
  join(process.cwd(), 'dist', 'nimmda-frontend', 'server', 'server.mjs')
).href;
const { reqHandler } = await import(serverModule);

export default function handler(req, res) {
  const url = new URL(req.url || '/', 'http://nimmda.local');
  const page = url.searchParams.get('p');
  if (page && page.startsWith('/') && !page.startsWith('//') && !page.includes('\\')) {
    url.searchParams.delete('p');
    const rest = url.searchParams.toString();
    req.url = page + (rest ? `?${rest}` : '');
  }
  req.originalUrl = req.url;
  return reqHandler(req, res, (error) => {
    if (error) {
      res.statusCode = 500;
      res.end('Internal Server Error');
      return;
    }
    res.statusCode = 404;
    res.end('Not found');
  });
}
