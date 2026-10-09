# Build with Abinash

Website for [@buildwithabinash](https://www.instagram.com/buildwithabinash/): free personal finance guides, the PDF library, and everything about the page. Live at https://buildwithabinash.github.io.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Add a guide

1. Put the PDF in `public/guides/<slug>.pdf`.
2. Add an entry to `src/lib/guides.ts` with `pdf: "/guides/<slug>.pdf"`, the topic, title, reel link and the date you last checked the numbers.
3. Push to `main`. GitHub Actions builds and deploys the site.

## Where things live

- `src/lib/site.ts`: name, email, social links (Instagram, broadcast channel, YouTube, Facebook)
- `src/lib/guides.ts`: guides, topics, "Start here" paths, the series
- `src/app`: pages (home, guides, single guide, about)
- `.github/workflows/deploy.yml`: static export to GitHub Pages
