import { cpSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const project = dirname(dirname(fileURLToPath(import.meta.url)));
const source = join(project, 'dist', 'nimmda-frontend', 'browser');
const target = join(project, 'dist', 'vercel-static');

rmSync(target, { recursive: true, force: true });
cpSync(source, target, { recursive: true });
rmSync(join(target, 'index.html'), { force: true });
rmSync(join(target, 'sitemap.xml'), { force: true });
