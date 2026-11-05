import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
try {
  process.loadEnvFile(path.join(root, '.env'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

function httpsUrl(value, name) {
  if (!value) return null;
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password || url.hash) {
    throw new Error(`${name} must be an HTTPS URL without credentials or a fragment.`);
  }
  return url;
}

const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const vercelOrigin = vercelDomain && `https://${vercelDomain}`;
const site = httpsUrl(process.env.SITE_URL || process.env.RENDER_EXTERNAL_URL || vercelOrigin, 'SITE_URL');
if (site && (site.pathname !== '/' || site.search)) throw new Error('SITE_URL must be the site origin.');
const endpoint = httpsUrl(process.env.LEAD_ENDPOINT, 'LEAD_ENDPOINT');
const source = path.join(root, 'src');
const out = path.join(root, 'dist');
if (path.dirname(out) !== root || path.basename(out) !== 'dist') throw new Error('Unexpected output directory.');
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(source, out, { recursive: true });

const html = await readFile(path.join(source, 'index.html'), 'utf8');
const siteMetadata = site ? `
  <link rel="canonical" href="${site.href}">
  <meta property="og:url" content="${site.href}">` : '';
await writeFile(path.join(out, 'index.html'), html
  .replace('<!-- canonical metadata -->', siteMetadata)
  .replaceAll('content="/assets/social.jpg"', `content="${site?.origin ?? ''}/assets/social.jpg"`));
await writeFile(path.join(out, 'config.js'), `export const leadEndpoint = ${JSON.stringify(endpoint?.href ?? '')};\n`);
console.log(`Built dist/ with pilot inquiries ${endpoint ? 'enabled' : 'disabled'}.`);
