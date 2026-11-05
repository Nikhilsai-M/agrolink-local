# AgroLink Local

A responsive farm-to-community concept site for a planned Bengaluru pilot. The page takes households from the problem and ordering model through an interactive product preview, RWA group ordering, the farmer workflow, FAQs, and pilot inquiries.

## Run locally

Requires Node.js 22 or newer. The project has no package dependencies.

```powershell
cd D:\agro-link
npm run dev
```

Open http://127.0.0.1:4173. Run `npm run build` after edits and reload the browser. `npm run lint` checks JavaScript syntax. `npm run preview` serves the existing build.

## Project layout

- `src/index.html` contains semantic landing-page content.
- `src/styles.css` contains the responsive design system.
- `src/app.js` contains reusable product rendering, session-only basket state, navigation, and inquiry handling.
- `src/assets/` contains local optimized images, the original logo mark, and a custom SVG icon sprite.
- `scripts/build.mjs` creates a clean `dist/` output and injects public build configuration.
- `vercel.json` supplies the static deployment settings.
- `render.yaml` supplies a Render Static Site blueprint.
- `.openai/hosting.json` identifies the connected Sites project.

This implementation uses HTML, CSS, and ES modules. npm registry resolution was unavailable during development, so the project uses a dependency-free static stack. All landing-page content is available without JavaScript. The interactive preview requires JavaScript.

## Lead capture configuration

The default form is visibly disabled. There is no inquiry database, email integration, or live lead-capture service.

1. Configure an authorized HTTPS inquiry endpoint that you control.
2. Copy `.env.example` to `.env` for local use, or set the same build environment variables in the hosting platform.
3. Set `SITE_URL` to the real HTTPS origin of the deployed site. This enables the canonical URL and absolute Open Graph image URL.
4. Set `LEAD_ENDPOINT` to the authorized inquiry endpoint, then rebuild.
5. Update the privacy information in `src/index.html` and `src/app.js` with the actual service provider, retention practice, responsible team contact, and deletion channel before collecting real details.
6. Test the configured service from the deployed origin with consent.

The endpoint must accept a JSON POST with this shape.

```json
{
  "name": "Name",
  "contact": "Email or Indian mobile number",
  "interest": "customer",
  "locality": "Locality",
  "message": "",
  "consent": true,
  "requestId": "client-generated-uuid"
}
```

Allowed interest values are `customer`, `rwa`, and `farmer`. Return HTTP 2xx with JSON `{"ok":true}` only after accepting the inquiry. An error response, missing receipt confirmation, or timeout shows an unconfirmed state and preserves the fields.

Support cross-origin JSON requests and OPTIONS preflight if the endpoint has a different origin. Validate and rate-limit on the server, record consent, and deduplicate requests by `requestId`. Unchanged retries reuse that ID during the current visit. The client blocks concurrent submissions and times out after 15 seconds.

The endpoint URL is public build configuration. Keep private service keys on your backend. Updating a host's environment variables requires rebuilding this static site.

## Deploy

### Vercel

Vercel's free Hobby plan is restricted to personal, non-commercial use. Assess AgroLink Local under its commercial-use rules before selecting a plan. [Vercel fair use guidelines](https://vercel.com/docs/limits/fair-use-guidelines#commercial-usage)

1. Push the source to your own Git repository.
2. Import that repository into Vercel.
3. Select framework preset **Other**, use build command `npm run build`, and output directory `dist`. The included `vercel.json` declares these settings.
4. Use Node.js 22 or newer. Set `SITE_URL` and, when ready, `LEAD_ENDPOINT`.
5. Deploy. Once Vercel assigns a production domain, set `SITE_URL` to that HTTPS origin and redeploy.

Vercel supports Git-based deployments. [Vercel deployment documentation](https://vercel.com/docs/deployments)

### Render

1. Push the source to a GitHub repository that your Render account can access.
2. In Render, select **New > Static Site**, connect that repository, and choose `main`.
3. Use build command `npm run build` and publish directory `dist`. Set `NODE_VERSION` to `22`.
4. Deploy. Set `SITE_URL` to the actual assigned HTTPS origin, then redeploy to generate canonical and Open Graph URLs for that host.
5. Configure `LEAD_ENDPOINT` only after an authorized inquiry service is ready, following the lead-capture instructions above.

You can also create the service through a Render Blueprint using the included `render.yaml`. Render Static Sites are free to deploy, subject to the workspace's included bandwidth and pipeline minutes. [Render Static Sites documentation](https://render.com/docs/static-sites)

### Netlify

Import the repository, use `npm run build` as the build command and `dist` as the publish directory. Set the same build variables and deploy. [Netlify build configuration](https://docs.netlify.com/build/configure-builds/overview/)

The build output is portable to other static HTTPS hosts.

## Scope and verification

The site includes a customer home screen, five-item catalog, product and example-grower details, a quantity-adjustable basket, a delivery-window selector, a reversible community-order simulation, and a farmer dashboard preview.

All listings, sourcing areas, harvest windows, quantities, prices, and participation counts are illustrative. Refreshing clears demo state. There are no live orders, payments, user accounts, confirmed partners, testimonials, or certifications.

The pricing FAQ separates the preliminary ₹500 produce-order assumption from a proposed 12% commission of ₹60. Weekly and four-week box amounts remain planning assumptions.

Verification covered 1280px desktop, 768px tablet, 390px mobile, and 320px narrow mobile views, internal anchor targets, image loading, mobile menu navigation and Escape, cart totals and removal, scheduling, reversible group participation, FAQs, privacy links, and console messages. A disposable local mock tested contact validation, loading, confirmed receipt, transport failure, and unconfirmed receipt. Real lead delivery still requires the configured endpoint. JavaScript syntax checks and the production build passed.

## Image provenance

Images were generated with the built-in imagegen tool for this project. Farm scenes and products are conceptual imagery. They depict no confirmed AgroLink supplier or partner. The assets are stored locally and require no remote image or font requests.

Saved outputs are `src/assets/hero.webp`, `hero-small.webp`, `farm.webp`, `tomatoes.webp`, `onions.webp`, `spinach.webp`, `potatoes.webp`, `carrots.webp`, `weekly-box.webp`, and `social.jpg`. The six catalog cells were mechanically sliced and resized. The social card combines the hero with brand text.

<details>
<summary>Generation prompt set</summary>

**Hero**

Use case: photorealistic-natural. Asset: portrait-oriented hero photo for a premium Bengaluru farm-to-community food website. High-end editorial food photograph taken at a gentle overhead angle, a very full round natural wicker market basket of real Indian market vegetables: red tomatoes, orange carrots with tops, red onions, crisp green spinach, okra, a few potatoes. Visible woven basket rim in foreground. Outside on a deep olive green wooden farm table, softly blurred foliage above, beautiful directional morning sun, saturated but natural jewel colors and deep shadows, grain and believable irregularities. Produce fills most of the frame, positioned centrally, with the full basket mostly visible. Aspect ratio about 4:5 vertical. No people, letters, logos, frames, text, or watermarks.

**Farm**

Use case: photorealistic-natural. Asset: wide supporting image for a Bengaluru farm-to-community concept website. Editorial agricultural photograph, wide horizontal view of orderly low vegetable beds on a smallholding in rural Karnataka, a few broad banana leaves along one edge, rich red soil between leafy rows, dark forested treeline, soft warm early-morning haze. One small distant unidentifiable worker seen from behind tending a bed, wearing everyday practical clothes. Grounded documentary aesthetic, real details, soft natural light, deep olive green and warm earth. No text, branding, overlays, or watermarks. Landscape 3:2.

**Catalog**

Use case: product-mockup. Create a source contact sheet that will be cut into 6 independent local produce product photographs for a farm shop. Perfect 3 columns × 2 rows in landscape 3:2, equal rectangular square cells, no gaps, no drawn borders. Each cell has its own uniform pale warm neutral background and simple subject centered in its own cell with generous surrounding margin. Top row from left to right: 3 ripe red tomatoes on vine, a pair of red onions one halved, a fresh bunch of dark green spinach. Bottom row from left to right: 3 small tan potatoes, 3 vibrant orange carrots with leafy tops, a small wicker basket filled with a mixed assortment of tomatoes carrots leafy greens and onions. Realistic clean premium editorial studio photo light, softly defined shadows. Strictly no text or graphics. Each of the six subjects fits fully within its own evenly divided square and is centered with no overlap.

</details>

