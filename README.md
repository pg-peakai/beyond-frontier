# Beyond Frontier

Marketing site for Beyond Frontier — training data for machines that work with
their hands. Next.js App Router: a single-page landing plus four sub-pages.

---

## Stack

| | |
| --- | --- |
| Framework | Next.js **16.3.3** (App Router) |
| React | 19.2.8 |
| Styling | Tailwind CSS **v4** — CSS-first, no `tailwind.config.js` |
| Motion | `motion` v13 (Framer Motion) + `lenis` smooth scroll |
| Fonts | `next/font/google` — Bodoni Moda (display), Geist, Geist Mono |
| Icons | `lucide-react` |
| Node | **24.x** |

> **Read this before touching Next config.** `AGENTS.md` in this repo warns that
> this Next.js version has breaking changes versus older training data. The
> authoritative docs ship inside the package, at `node_modules/next/dist/docs/`.
> Consult those rather than relying on memory — CLI flags in particular have
> moved. Binding the host is `next start -H <host>`; the `HOSTNAME=` env var is
> ignored, which is easy to get wrong and hard to notice.

---

## Running locally

```bash
npm ci
npm run dev
```

Then open http://localhost:3000.

Other scripts:

```bash
npm run build
npm start
npm run lint
npm run globe-data
```

`globe-data` regenerates `public/globe-land.json` from `world-atlas`.

**No environment variables are required.** The app reads no `process.env`
anywhere — there is nothing to configure to get it running.

---

## Where things live

```
src/
  app/
    page.tsx              landing — composes the five screens
    about/ buyers/ partners/ contact/
    api/contact/route.ts  form endpoint (see Known gaps)
    globals.css           ALL design tokens live here
    layout.tsx            fonts, metadata
  components/
    hero.tsx              screen 1 — plate, headline, embedded nav
    globe.tsx             screen 2 — canvas globe, rotating, video windows
    experience-deck.tsx   screen 4 — copy + progressive timeline
    capture-site.tsx      screen 5 — the two ticket shapes
    top-nav.tsx           shared nav — used by hero AND every page header
    page-header.tsx       sub-page opener, mirrors the hero
    ui.tsx                Reveal / RevealLines / Label / Button / Section
  content/
    site.ts               ALL COPY — single source of truth
public/
  hero-plate.png          hero artwork
  cards/                  the four elongated card images
  clips/                  hover-video clips (H.264, muted, faststart)
  globe-land.json         pre-baked land polygons for the globe
```

**Copy changes go in `src/content/site.ts`, not in components.** Some legacy
keys there (`thesis`, `doing`, `moat`, `whatYouGet`, `domains`, `how`, `cta`)
are no longer rendered — prune them or leave them, but don't assume they're
live.

---

## The design system

Tokens live in `src/app/globals.css` under `@theme`. Tailwind v4 is CSS-first,
so **there is no config file** — declare a token there and Tailwind emits the
utility.

| Token | Value | Use |
| --- | --- | --- |
| `--color-ink` | `#0b0b0c` | text, dark sections |
| `--color-paper` | `#f2f1ee` | default page ground |
| `--color-canvas` | `#eeeae5` | hero and page-header ground |
| `--color-signal` | `#26603e` | accent on **light** grounds |
| `--color-signal-soft` | `#4cb37e` | accent on **dark** grounds |
| `--color-gold` | `#7f631f` | nav buttons |
| `--color-success-ink` | `#0f7a3d` | timeline numerals |

Those pairings are deliberate, not decorative. `--color-signal` is only 2.65:1
on ink, which is why dark sections use `signal-soft`; the bright timeline green
is 2:1 on white, which is why numerals use `success-ink`. If you add a colour,
check it against the ground it sits on before shipping.

House style, so later additions stay coherent:

- **Headlines** are Bodoni Moda (`font-didone`), `leading-[0.96]`,
  `tracking-[-0.015em]`, and the **closing line turns italic signal-green**.
  That italic line also gets `-ml-[0.17em]`: the italic W carries more left side
  bearing than a roman I, so without the pull it reads visibly indented.
- **Buttons and labels** are Geist Mono, uppercase, `tracking-[0.18em]`, and
  **square**. No border radius anywhere except genuine dots.
- **No orange.** An earlier `--color-accent` (`#f2531b`) was removed sitewide;
  reintroducing it will break coherence immediately.
- Section rhythm alternates cream → ink → textured paper → white → cream.

Useful utilities in `globals.css`: `.u-container`, `.u-label`, `.u-grid` (graph
paper), `.u-gold` (brushed-gold sheen), `.u-ticket` (notched movie-ticket
silhouette via mask + clip-path), `.u-pulse`, `.u-footer-mark`.

---

## Deploying

This is a Next.js **server** app, not a static export — the contact route is
dynamic. It needs a Node runtime. Anything that runs Node works.

### Vercel / Netlify / Render

Import the repo and accept the defaults. No env vars needed.

### A plain VM (Ubuntu 24.04)

Full runbook for a fresh box with ports 80/443 open and SSH restricted to your
own IP.

**1. Node 24, nginx, pm2**

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs nginx
sudo npm install -g pm2
```

On a 2 GB box, add swap first or `next build` gets OOM-killed partway through:

```bash
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile
```

**2. Code and build**

```bash
sudo mkdir -p /srv/beyond-frontier && sudo chown -R $USER:$USER /srv/beyond-frontier
git clone <this-repo> /srv/beyond-frontier
cd /srv/beyond-frontier && npm ci && npm run build
```

**3. Run under pm2, bound to loopback**

Nginx should be the only publicly reachable process, so bind Next to
`127.0.0.1`. Note the flag — `HOSTNAME=` is ignored by this version and the app
will silently listen on all interfaces:

```bash
cd /srv/beyond-frontier
pm2 start ./node_modules/.bin/next --name beyond-frontier -- start -H 127.0.0.1 -p 3000
pm2 save
pm2 startup systemd
```

`pm2 startup` prints a command — run it, or the app won't survive a reboot.

**4. Reverse proxy** — `/etc/nginx/sites-available/beyond-frontier`:

```nginx
server {
    listen 80 default_server;
    server_name your-domain.com www.your-domain.com _;
    client_max_body_size 25m;

    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -sf /etc/nginx/sites-available/beyond-frontier /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

**5. Verify from outside the box**, not from on it:

```bash
curl -I http://YOUR_SERVER_IP/
```

Then confirm the app port is *not* reachable publicly — this must fail:

```bash
curl --max-time 8 http://YOUR_SERVER_IP:3000/
```

**6. TLS**, once DNS points at the box:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

If you front the site with Cloudflare's proxy instead, note the origin above
serves **HTTP only**: set SSL/TLS mode to **Flexible**, or install a cert on the
origin first. `Full` or `Full (strict)` against an HTTP-only origin returns
522/525.

### Redeploying

```bash
cd /srv/beyond-frontier && git pull && npm ci && npm run build && pm2 restart beyond-frontier
```

Two gotchas that cost real debugging time:

- **The image optimizer cache is cold after every build.** The first request for
  the hero plate takes several seconds and the page renders without it. Warm it
  after deploying so visitors don't hit that:
  `curl -o /dev/null "http://localhost/_next/image?url=%2Fhero-plate.png&w=1920&q=75"`
- **Verify the served HTML, not a screenshot.** If a restart fails to bind
  because the old process still holds the port, the failure is silent and you'll
  be looking at a stale build while believing it deployed.
  `curl -s http://IP/ | grep something-from-your-change` is the honest check.

---

## Known gaps

- **The contact form does not send anything.** `src/app/api/contact/route.ts`
  validates the payload, drops bots with a honeypot, then `console.info`s the
  enquiry and returns `{ok: true}`. The submitter sees a success state either
  way. Wire a real sink — Resend, a Slack webhook, a database — before relying
  on it.
- **`BRAND.email` in `src/content/site.ts` is a stale placeholder**
  (`hello@peakrobotics.ai`, from an earlier name). It is shown on the contact
  page and in the footer. Point it at a mailbox that exists.
- `metadataBase` in `src/app/layout.tsx` is set to `https://byndfrntr.com`.
  Change it if you host elsewhere, or the Open Graph URLs will be wrong.
- The globe's video windows reference clips in `public/clips/`. If you swap
  them, keep them muted and encoded with `-movflags +faststart`, or browsers
  will block autoplay.
- Legacy unused keys remain in `site.ts` (listed above).

---

## Licence

No licence granted. All rights reserved.
