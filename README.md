# Air conditioning technician website template (demo: AirTrace, the Sharon region)

Static Astro site, Hebrew RTL, built so the same code can be offered to another AC technician
(or another home-services trade) by editing one file.

## New client in 4 steps

1. **Edit `src/config/site.config.ts`** - identity, owner, phone/WhatsApp, weekly hours (drive the live
   "open now" chip and the schema), hot-season months, theme colors, services (one page each), service areas
   (one page each, with content written for that city), capacity calculator factors, symptom guide, prices,
   maintenance plans, reviews, before/after gallery, FAQ, form destinations and legal details.
   Nothing client-specific is typed into pages or components.
2. **Replace images** in `src/assets/img/` (same file names, or update the imports at the top of the config).
   See `CREDITS.md` for the current demo stock photos.
3. **Set `site.url`** and **`site.isDemo: false`** (demo mode adds noindex to every page and a demo note in the footer).
4. **Regenerate icons** after a color change: `npm run icons`, then `npm run build`.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server at http://localhost:4321 |
| `npm run build` | Build to `dist/` |
| `npm run preview` | Serve the built site |
| `npm run audit` | Check the build: broken links, orphans, titles, descriptions, H1, canonical, JSON-LD, alt, em dashes |
| `npm run icons` | Rebuild favicon and app icons from the theme colors |
| `npm run checklist` | Write the progress file for the Website Build Checklist |

## What is on the site

- Horsepower (BTU) calculator drawn as a thermostat gauge: area, sun, top floor, people, ceiling, open kitchen.
  The result can be sent to the technician on WhatsApp with one tap. Compact version in the home hero.
- "The AC is not working" symptom guide: likely cause, safe self-checks, when to call, prefilled WhatsApp message.
- Live status chip in the header (Israel time, from the weekly hours; same-day promise in the hot season).
- Before/after switch per project, gallery filter by job type.
- Yearly "clean the AC before summer" reminder as a downloadable calendar file (.ics), created in the browser.
- Trust facts laid out as an equipment rating plate.
- Schematic map of the service area with arrival times, plus a text list with the same data.
- Schema: `HVACBusiness` (LocalBusiness) with areas, weekly hours, rating and offer catalog; `Service`, `FAQPage`,
  `HowTo`, `Review`, `BreadcrumbList`, `Person`, `ItemList`.

## Contact form

`form.destinations` in the config. Every lead goes to every destination in parallel; use two
(email via Web3Forms + a webhook to a Google Sheet) so no lead is lost. Empty list = demo mode.
Analytics (GA4) loads only after cookie consent; set `analytics.ga4`.

## Hosting

Built for Cloudflare Pages (any static host works). `public/_headers` holds security and cache headers.
