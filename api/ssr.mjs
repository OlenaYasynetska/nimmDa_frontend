import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

const serverModule = pathToFileURL(
  join(process.cwd(), 'dist', 'nimmda-frontend', 'server', 'server.mjs')
).href;
const { reqHandler } = await import(serverModule);

const PREFIX = '/api/ssr';

export default function handler(req, res) {
  const url = req.url || '/';
  const queryIndex = url.indexOf('?');
  const path = queryIndex === -1 ? url : url.slice(0, queryIndex);
  const query = queryIndex === -1 ? '' : url.slice(queryIndex);
  let nextPath = path;
  if (path === PREFIX) {
    nextPath = '/';
  } else if (path.startsWith(`${PREFIX}/`)) {
    nextPath = path.slice(PREFIX.length) || '/';
  }
  req.url = `${nextPath}${query}`;
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
