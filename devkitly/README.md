# DevKitly — developer tools site (Next.js 14)

20 free, browser-based developer tools. Light/dark theme, instant search (press `/`), live results as you type, static pre-rendered pages for SEO.

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
tools/                    # har tool ka component ("use client")
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
