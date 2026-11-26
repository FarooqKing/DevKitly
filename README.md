# DevKitly — free online tools site (Next.js 14)

> Latest: SEO tools (meta tags, OG preview, sitemap, robots.txt), text tools, JSON/XML/YAML/CSV converters, HTML/JS/SQL formatters, barcode, invoice, favicon, random generators. Category colour-coding, polished hero, back-to-top.

126 free tools (browser-based + a few server-assisted): PDF (merge, split, compress, convert, watermark…), Office (Excel/CSV/JSON/Word), 10 calculators, developer utilities, image converter. Light/dark theme, instant search (press `/`), live results as you type, static pre-rendered pages for SEO.

## Run
```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Structure
```
site.config.ts            # naam, tagline, URL, GitHub — live se pehle yahan change karo
lib/tools.ts              # har tool ka metadata: name, icon, SEO description, about text
tools/                    # developer tools
tools/pdf/                # PDF tools (pdf-lib + pdfjs-dist; worker in public/pdf.worker.min.mjs)
tools/office/             # Excel/Word tools (xlsx, docx, mammoth)
tools/calc/               # calculators (_ui.tsx = shared Field/Stat/Layout)
components/FileDrop, FileList, Progress  # shared file-tool UI
tools/_TwoPane.tsx        # reusable live input→output converter
tools/index.ts            # slug -> component
app/tools/[slug]/page.tsx # metadata + JSON-LD + layout (sidebar + about + related)
components/               # Header, Footer, SearchBox, Sidebar, Pane, ToolCard, CopyButton, ThemeToggle
```

## Naya tool add karna
1. `lib/tools.ts` mein entry add karo (slug, name, icon from lucide-react, description, about).
2. `tools/MyTool.tsx` banao. Simple text→text tool ke liye `_TwoPane` use karo (5 lines).
3. `tools/index.ts` mein map karo.
Home, sidebar, search, footer, sitemap sab auto update.

## Deploy
GitHub → Vercel import → done. Domain lene ke baad `site.config.ts` mein `url` update karo.

## AdSense
`components/ToolPage.tsx` mein `Ad slot` comment ke neeche unit lagao; script `app/layout.tsx` mein.

## Note: pdf.js worker
`public/pdf.worker.min.mjs` is copied from `node_modules/pdfjs-dist/build/`. Agar pdfjs-dist upgrade karo toh file dobara copy karo.

## Pages
`/` home · `/tools` all tools (search + filter) · `/category/[slug]` category pages · `/tools/[slug]` tool pages (FAQ + schema) · `/about` · `/contact` · `/privacy` · `/terms`

## SEO built in
Per-page metadata + canonical, OG images (auto-generated per tool), sitemap.xml, robots.txt, web manifest, JSON-LD (WebSite + SearchAction, Organization, SoftwareApplication, BreadcrumbList, FAQPage, CollectionPage).

## Analytics
Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_GA_ID=G-XXXXXXX`.

## Fonts
Self-hosted via @fontsource (no Google Fonts dependency) — works where fonts.googleapis.com is slow or blocked.

## Before going live
1. `site.config.ts`: name, url, twitter, github
2. Privacy/Terms pages: email addresses auto-use your domain; review wording
3. Add AdSense script to `app/layout.tsx` and ad unit in `components/ToolPage.tsx` after approval

## Env vars (Vercel → Settings → Environment Variables)
See `.env.example`: GA id, Google/Bing site verification, AdSense client id.

## Server tools (app/api/*)
`/api/pagespeed`, `/api/links`, `/api/grammar`, `/api/screenshot` — Node runtime, per-IP rate limited (lib/server.ts), SSRF-safe (private IPs blocked). Work on Vercel and on your own server.

## Deploy on your own server
```bash
npm install && npm run build
npm start                      # port 3000
# or with PM2:
npm i -g pm2 && pm2 start npm --name devkitly -- start && pm2 save
```
Put Nginx/Caddy in front for HTTPS. Set env vars in `.env.local` (see `.env.example`).

## New in this version
Resume/CV Builder · SEO: keyword density, schema generator, UTM builder, redirect & header checker · Social Media category (YouTube thumbnail/embed, image resizer, thread splitter, char counter, hashtags, fancy text) · Video & Audio category (video→MP3, audio converter, MP3 cutter, video trimmer, video→GIF, voice & screen recorder) · 17 SEO alias pages (json-minifier, character-counter, csv-to-json…) in `tools/aliases`.
