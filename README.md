# Celine Nova

Personal site for [celinenova.com](https://celinenova.com) — BCI research, neurotech, art, photography, and daily writing.

Built with [Next.js](https://nextjs.org).

## Development

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

## Amazon Associates

The bookshelf uses direct Amazon product links. Add the approved tracking ID
from Amazon Associates as `NEXT_PUBLIC_AMAZON_ASSOCIATES_TAG` locally and in
Vercel. Tagged links, the nearby paid-link label, and the required site
disclosure then appear automatically.

```bash
NEXT_PUBLIC_AMAZON_ASSOCIATES_TAG=celinenova-20
npm run bookshelf:audit
```

## Deploy

Deploy to [Vercel](https://vercel.com) or any Node.js host that supports Next.js 16.
