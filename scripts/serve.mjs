import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const out = fileURLToPath(new URL('../dist/', import.meta.url));
const port = Number(process.env.PORT || 4173);
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg' };

createServer(async (request, response) => {
  try {
    const { pathname } = new URL(request.url, 'http://localhost');
    const filename = path.resolve(out, `.${pathname === '/' ? '/index.html' : decodeURIComponent(pathname)}`);
    if (path.relative(out, filename).startsWith('..')) {
      response.writeHead(404).end();
      return;
    }
    const body = await readFile(filename);
    response.writeHead(200, { 'Content-Type': mime[path.extname(filename)] ?? 'application/octet-stream' });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch (error) {
    response.writeHead(error.code === 'ENOENT' || error.code === 'EISDIR' ? 404 : 400).end();
  }
}).listen(port, '127.0.0.1', () => console.log(`Local preview at http://127.0.0.1:${port}`));
