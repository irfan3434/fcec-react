# FCEC

Company site for Future Cities for Engineering Consultations, migrated off
Shopify. Vite + React, bilingual (English / Arabic), deployed as static files.

```bash
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
npm run lint
```

## Layout

```
src/
  components/layout/   Site chrome: TopBar, Header, Footer, Layout
  content/             Data lifted out of Shopify settings and admin pages
  i18n/                Locale config, provider, dictionaries
  pages/               One component per route
  sections/            Ported theme sections, one folder each
  styles/              tokens.css (design tokens) + global.css (base layer)
scripts/
  extract-locales.mjs  Regenerates locale dictionaries from the Shopify theme
```

## Locales

English is served from the bare path (`/about`), Arabic from a prefix
(`/ar/about`) — the same shape the Shopify site used, so inbound links survive.

`LocaleProvider` reads the locale back off the URL and is the only thing that
sets `<html lang>` and `<html dir>`. Use `<LocaleLink>` for every internal link
so visitors stay in their language.

Two dictionaries per locale:

- `src/i18n/locales/{en,ar}.json` — **generated**. Run
  `node scripts/extract-locales.mjs` to refresh from the theme export; never
  hand-edit, it gets overwritten.
- `src/i18n/locales/{en,ar}.app.json` — keys this app owns (navigation, UI
  chrome, anything Shopify kept in admin). These win on collision.

## Porting a section

1. New folder under `src/sections/<Name>/` with `<Name>.jsx` and
   `<Name>.module.css`.
2. Liquid `{{ 'translations.x' | t }}` becomes `t('x')` — the key is already in
   the generated dictionary.
3. Liquid `{{ settings.x }}` becomes a field in a `src/content/` data file.
   Shopify settings are gone; the data is ours now.
4. Port the CSS, but refine rather than copy: reference tokens from
   `styles/tokens.css` instead of raw hex, use logical properties
   (`margin-inline`, `inset-inline-start`) so RTL works for free, and drop the
   dead rules.
5. Reuse what is already shared rather than restyling it: `components/ui/Button`
   for calls to action, `hooks/useInView` for a scroll entrance,
   `components/media/BackgroundMedia` for any autoplaying loop.
6. Check it at desktop, tablet and mobile width, in both locales, before
   moving on.

### Ported so far

| Section | Source | Notes |
| --- | --- | --- |
| Header + top bar | `sections/header.liquid` | Redesigned; search, dropdowns and employee login still missing |
| Hero banner | `sections/header.liquid` | `hero-banner.liquid` was dead code |
| About intro | `sections/aboutus-section.liquid` | Media re-hosted and re-encoded |
| Services | `sections/service-section.liquid` | Autoplay carousel replaced with a 3x3 grid |
| Spotlight | `sections/spotlight-showcase.liquid` | Showcase kept; given controls, a scrim and RTL-correct captions |
| International partners | `sections/international-partners.liquid` | Logos re-exported to one canvas; flags moved inline beside country names |
| Local partners + clients | `sections/client.liquid` | Both walls share `components/LogoWall` with international partners |
| Counter | `sections/counter-section.liquid` | Figures count up on scroll; drifting drawing grid behind them |
| Accreditation | `sections/accreditation-section.liquid` | Third wall on `components/LogoWall`; exported at a taller height cap |
| Footer | `sections/footer.liquid` | Four branches, real legal routes, RTL-correct link markers |
| About page | `templates/page.about.liquid` | CEO message and company story; portfolio video left out |
| Careers page | `templates/page.careers.liquid` | Content only; openings list is empty and the application form is not built |
| Services page | `templates/page.services.liquid` | Nine cards, each linking to a detail page |
| Service detail | none — they were Shopify products | Hero, service index, copy and gallery with a lightbox |
| Projects page | `templates/page.projects.liquid` | Thirty cards, each linking to a detail page |
| Project detail | `templates/product.liquid` | Hero, facts card, copy and gallery with a lightbox |
| Contact page | `templates/page.template.liquid` | Email, phones, four branches and socials; popup skipped |

Remaining on the homepage, in `templates/index.liquid` order:
`latest-landmark`.

Pages still on `PagePlaceholder`: the three legal pages the footer links to.

## Media hosting

Content files store bare paths (`hero/fcec-hero.mp4`) which
`src/lib/media.js` resolves against `VITE_MEDIA_BASE_URL`. Leave it empty and
media comes from the app's own `public/` folder; set it and the same paths
come off a CDN instead. No component knows the difference, so moving media
later is an environment variable, not a refactor.

### Where to put the video

The site deploys to Vercel with `fcec.sa` pointed there by DNS record, so
Cloudflare is not in the picture and R2 custom domains are unavailable (they
require the domain to be a Cloudflare zone).

That is fine. A hero loop is a short, muted, looping clip — it is not
*streaming* in the adaptive-bitrate sense, it is one small file a browser
downloads and plays. Once it is encoded properly, **the encoding matters far
more than the host**. A 20 MB file stutters everywhere; a 3 MB file is smooth
off almost anything.

**Default: ship it in `public/`.** Put the files at `public/hero/`, leave
`VITE_MEDIA_BASE_URL` empty, and Vercel serves them from its own edge CDN with
range requests and immutable caching, no second service and no credentials.

```
public/hero/fcec-hero.webm
public/hero/fcec-hero.mp4
public/hero/fcec-hero.jpg
```

The trade is that the binary lives in git forever and the bytes count against
Vercel's bandwidth allowance (100 GB/month on Hobby at the time of writing —
check your plan). At ~3 MB both are a non-issue for a brochure site. Start
here; move only if the numbers say so.

**If you want it off the repo**, in rough order of fit:

| Option | Why | Watch out for |
|--------|-----|---------------|
| **Bunny.net** CDN | ~$0.01/GB, PoPs in the Middle East, and a `b-cdn.net` pull-zone hostname that works with no DNS change at all. Best value for video. | Another vendor and invoice. |
| **Vercel Blob** | Same dashboard and CDN as the deploy, upload from the Vercel UI. | Bandwidth bills like the rest of Vercel; thinner free tier. |
| **Keep R2**, served by a Worker on `*.workers.dev` | Keeps the file already uploaded, no zone needed, and unlike `r2.dev` the Workers free tier is a supported production path. | A Worker to write and maintain; URL is not on your domain. |
| **R2 `r2.dev` URL** | One click, nothing to build. | Rate-limited, uncached, Cloudflare says not for production. Development only. |

Cloudflare **Stream** is the wrong tool here either way: it bills per minute
stored *and* per minute delivered, and its strengths — adaptive bitrate,
analytics, signed URLs — are things a 20-second muted background loop has no
use for. (Its HLS manifest can be driven from a custom player, so the iframe
is avoidable, but the cost argument stands.)

Whichever you pick, set the base URL and restart — Vite reads env files only
at startup:

```bash
# .env.local / Vercel project environment variables
VITE_MEDIA_BASE_URL=https://fcec.b-cdn.net   # empty = serve from public/
```

### Object keys

If you do host remotely, avoid spaces. `FCEC Video editing.mp4` becomes
`FCEC%20Video%20editing.mp4` in a URL — it works, but it breaks on careless
copy-paste, in logs, and in anything parsing URLs loosely. Name files to match
the paths in `src/content/hero.js`.

### Encoding the hero video

The hero in `public/hero/` is done:

    fcec-hero.mp4   H.264, 960x540, 25 fps, 16.2 s, 3.88 MB, faststart, no audio
    fcec-hero.jpg   26 KB poster, the video's own frame at 00:00:01

The video arrived as `intro-video.MOV`, which was misleading — the container
was already `mp42` with H.264 inside, so renaming it was correct rather than a
workaround. Two passes were run on it:

```bash
# lossless remux: index to the front, audio track dropped
ffmpeg -i fcec-hero.mp4 -c copy -an -movflags +faststart fcec-hero.fast.mp4

# poster, from the same opening shot the video starts on
ffmpeg -ss 00:00:01 -i fcec-hero.mp4 -frames:v 1 -q:v 3 fcec-hero.jpg
```

Without faststart the `moov` index sat in the last 0.2% of the file, so the
browser needed a second range request before it could decode a frame. It now
sits at byte 36. Dropping the muted audio track saved 194 KB.

If you ever re-encode from a camera master, three flags decide whether a
background video works at all: `-movflags +faststart`, `-pix_fmt yuv420p`
(Safari refuses anything else), and `-an`. Aim under 5 MB.

A VP9 WebM listed *ahead of* the MP4 in `formats` would serve everything but
Safari at roughly half the bytes. Not worth it at this size, but the command
is:

```bash
ffmpeg -i fcec-hero.mp4 -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -pix_fmt yuv420p -an fcec-hero.webm
```

## Still to resolve

- **Hero video is only 960x540.** It is upscaled 2x on a 1080p screen and
  more on a large desktop, so it reads soft. The source edit was 20.67 MB and
  may well be 1080p — re-exporting the hero from that master at 1920 wide
  would fix it without changing anything in the app.
- **The counter band has no video or icons.** `COUNTER_MEDIA` in
  `src/content/counter.js` lists no file, so the band paints its own brand
  gradient; add a path and the video layers over it. The four 80x80 icons
  were Shopify store images rather than theme assets, so they did not come
  across — drop them in `public/counter/` and set `icon` on each stat.
- **"Projects Executed" is 30.** The theme said 20; Irfan corrected it
  during the port. The other three figures are the theme's: 9, 70, 12.
- **Media is on Shopify's CDN.** Most images, and six more videos, still
  point at `cdn.shopify.com`. They need downloading and re-hosting before the
  store is closed, or they vanish with it. Done so far: the hero
  (`public/hero/`) and the About loop (`public/about/`). Still on the CDN:
  `counter_background_video_url`, `introductory_video_file_url`,
  `popup_video_url`, `contact_popup_video_url`, `landmark_video_file_url`.
- **The About page images are stock.** `page-about/ceo.webp` is an
  AI-generated desk scene — an empty leather chair, a book embossed "CEO"
  over a line of garbled type — and `page-about/our-story.webp` is a stock
  photograph of downtown towers with nothing Saudi in it. Both are the
  theme's own `CEO_image` and `company_image` settings, re-exported at 1024
  square. A photograph of the CEO, and of FCEC's own work, would say more
  than either. Masters are in `media-src/page-about/`.
- **The About page's portfolio video is left out.** `page.about.liquid`
  opened on an "Our Portfolio" block playing
  `settings.introductory_video_file_url`, with a "Download Video" link beside
  it. Dropped at Irfan's request; the URL is recorded in
  `src/content/about.js` if it should come back.
- **About has no page-level lead.** The template went straight from the video
  to the CEO's message, so there is no sentence introducing the page. The
  masthead carries the title alone.
- **Careers has no application form.** `JOB_OPENINGS` in
  `src/content/careers.js` is empty, so the page shows its "no openings"
  panel, and `APPLICATION_URL` is `null`, so the "Apply Now" button under
  "How to Join Us" does not render. Shopify still has one opening set —
  "Marketing expert", pointing at `https://www.fcec.sa/pages/apply-now-1/`,
  which is the Shopify form and will not survive the migration. The theme
  also had `job_1` through `job_8` in settings while the template only read
  the first two, so openings 3 to 8 could be filled in and never appear.
- **`careers_template_paragraph_2` refers to a link that is not there.** It
  reads "Click the following link and find where your expertise meets our
  needs", and the CTA under it is commented out in `page.careers.liquid`, so
  the live page has been ending on an instruction with nothing to follow.
  Setting `APPLICATION_URL` brings the button back; the copy may want
  rewording if applications go somewhere else.
- **Three Arabic careers terms are mistranslated.** In `ar.json`,
  `careers_list_part_9` "Potential" became "محتمل" (probable, the
  adjective), `careers_list_part_11` "Capacity" became "سعة" (volume), and
  `careers_list_part_13` "Calibre" became "عيار" (the gun or assay sense).
  All three are machine-translation misreads of the English word's other
  meaning, and all three are the bold opening word of a bullet in "Your Role
  in Our Vision". They need a human pass.
- **`careers_list_part_18/19/20` are unused.** They were the "SR #",
  "Position" and "Details" column headings of a table that is now a list.
  The row counter was never information, and the "Details" column held a
  button rather than details.
- **The live Contact page mails the wrong company.** Its "Email Us" link
  reads `info@futurecityec.com` and points at
  `mailto:info@rougeradiance.com`. Anyone who clicks it on fcec.sa writes to
  a different business. Both phone links are also wrong: they share one
  `href` of `tel:966500399991`, so the number shown as +966558808533 dials
  the other one, and neither carries the leading `+`. All three are typed
  into the Shopify page body, so they need fixing in admin as well — the
  port reads `CONTACT` in `src/content/site.js` instead.
- **The Contact page's newsletter section is dropped.** The template ended
  on a "Join Our Newsletter" heading above `<!-- Add your form here -->`.
  There is no form and no list; it has been a heading over nothing since
  launch. Bring it back when there is somewhere for an address to go.
- **The contact popup is not ported.** `sections/contact-popup.liquid` is a
  full-screen image slideshow that opens over the page. Skipped at Irfan's
  request. The theme also has an unused `sections/contact-form.liquid`,
  referenced by no template.
- **Contact prose is translated.** The Shopify page body is English only and
  `/ar/pages/contact` redirects away, so the Arabic for the intro, the email
  and phone notes and the section headings is in `ar.app.json` under
  `contact.*`. The four branch names and addresses already existed in both
  languages as `footer_headings_text_6` to `_13`, and the page reads them
  from `src/content/footer.js` rather than repeating them.
- **Project titles, clients and facts are translated.** The index template
  referenced a `project_<name>_title` and `_client` pair for every card —
  about seventy keys in all, plus `projects_eyebrow`, `projects_card_cta`
  and the rest — and **not one of them exists** in `en.default.json` or
  `ar.json`, so every title and client name on the live page renders as an
  empty string. All thirty now have Arabic in `ar.app.json` under
  `projects.<handle>.title` and `.client`, which override the English the
  store supplies. The facts table is translated in
  `src/content/projectFacts.js`: 8 labels and 68 values, keyed by the exact
  English string. Years stay as numerals, and the Client row reads from the
  per-project override so the card and the facts card cannot drift apart.
  The overview prose is translated in `src/content/projectOverviews.js` —
  all 38 paragraphs across the thirty projects, paragraph for paragraph, so
  a project with no Arabic yet falls back to the English rather than going
  blank. **The Arabic is mine and wants a native read-through** —
  particularly the official entity names (ministries, municipalities,
  authorities), the technical vocabulary in Project Area and Project
  Sector, and the marketing register of the longer overviews, which is
  where a translator's judgement matters most.
- **Two store-side typos are patched in the app, not fixed at source.**
  The Al Jawhara project's client reads "Private Scetor", and the
  valley-and-reef project has its *Arabic* title sitting in the English
  title field (and that Arabic renders "الشعاب المرجانية", coral reefs,
  where the project means watercourses). Both are overridden in
  `en.app.json` / `ar.app.json`; correcting them in Shopify would let the
  overrides go.
- **`src/content/projectDetails.js` is generated.** Do not edit it by hand.
  `scripts/fetch-store-products.py` pulls the whole catalogue in one request
  — fetching handles one at a time trips the store's rate limiter after a
  dozen — and `scripts/build-project-details.py` parses the descriptions,
  re-hosts the images and writes the module. The card art and the handle for
  each project are listed in `scripts/projects.tsv`.
- **Eighteen of the thirty projects have no gallery.** Those products carry
  no images in Shopify, so their detail pages show the hero, the facts card
  and the overview, and the gallery section is left out. The other twelve
  have 50 images between them. Adding images in Shopify admin and re-running
  the build picks them up. Galleries are capped at eight per project
  (`MAX_GALLERY` in `scripts/build-project-details.py`); nothing hits the cap
  today, and each project records any surplus in `extraImages`.
- **Four projects are still hidden.** The theme kept them commented out of
  the index: `supervision-of-the-project-implementation-coordination-office`,
  `panoramic-laser-surveying-works-green-riyadh`,
  `consultancy-for-land-subdivisions-in-affiliated-governorates-villages`
  and `engineering-consultancy-for-the-land-subdivisions-project-madinah`.
  Add a row to `scripts/projects.tsv` and re-run the build to publish one.
- **`/products/<handle>` needs a redirect for projects too.** Thirty more
  URLs that move to `/projects/<handle>` — same handles, different segment.
- **Service descriptions are English only.** The nine services were Shopify
  products, and the store had no Arabic product descriptions —
  `/ar/products/<handle>.json` returns 404 for every one of them, and the
  theme's locale files carry none either. So an Arabic visitor on a service
  detail page gets the page furniture in Arabic and the body copy in
  English. Translating the nine descriptions is the single biggest content
  gap left. They are in `src/content/serviceDetails.js`; the shape already
  allows a per-locale value.
- **`src/content/serviceDetails.js` is generated.** Do not edit it by hand —
  `scripts/build-service-details.py` rebuilds it from the product records in
  `media-src/services-data/`, re-hosting the galleries on the way. Re-fetch a
  record with
  `curl -o media-src/services-data/<handle>.en.json https://www.fcec.sa/products/<handle>.json`
  and re-run the script. The 43 gallery images are 8.3 MB of masters in
  `media-src/services-gallery/` and 4.9 MB of 1000px WebP in
  `public/services-gallery/`, between 216 kB and 1.1 MB per service.
- **The Services page had no card titles.** The template printed
  `settings.duty_1_headline` through `duty_10_headline` and no such setting
  has ever existed, so all nine cards on the live page are pictures with
  nothing naming them. The port uses the translated service names the
  homepage already uses. The `duty_image_1..10` GIFs those cards used are
  not carried over either — they are animated versions of the same nine
  subjects as `service_icon_1..9`, and the page skipped `duty_image_5`.
- **`/products/<handle>` needs a redirect.** Every service URL the site has
  published for years is `/products/<handle>`; the new one is
  `/services/<handle>`. Same handles, different segment, so a single rule
  covers all nine.
- **Image masters live in `media-src/`.** Not copied into the build. The nine
  service originals (1024x1024) are there; `public/services/` holds the 400px
  versions the site actually serves. Partner and client logos work the same
  way: masters in `media-src/`, trimmed 480x240 WebP exports in `public/`.
  `scripts/normalize-logos.py` does the conversion, driven by the TSV maps
  in `scripts/`; re-run it after dropping new masters in. The flags are in
  `public/international-partners/flags/` at a shared 36px height.
- **Client names are English only.** `src/content/clients.js` carries one
  name per client, used as the logo's alt text. Seven of the ten are Saudi
  public bodies with official Arabic names, which an Arabic visitor should
  hear instead; add them as translation keys once they are confirmed.
- **The first client logo is identified from its calligraphy.** The square
  Kufic emblem reads as Riyadh Region Municipality — the Najdi tower above
  it and the inner "الرياض" both point there — but nothing in the theme
  named it. Worth confirming.
- **Three local-partner files are unused.** `ATC`, `Algwahmed` and a second
  copy of `Gevinst` are in `media-src/local-partners/` but are not on the
  live site's partners wall. Gevinst is already an international partner.
  They may belong to the clients wall.
- **Some logos are upscaled to reach the shared canvas.** Larsen & Toubro
  (186x36 of ink) by 2.3x, GACA by 1.9x, Dar Al Riyadh by 1.3x, AIT and
  Gevinst by about 10%. They are roughly 1:1 at render size, so the cost
  is softness on a high-density screen only. Larger masters would drop
  straight in; the client logos in particular are all 200x200, and the IAF
  seal has only 147x92 of ink inside its 300x300 file.
- **The legal pages are placeholders.** `/terms`, `/disclaimer` and
  `/privacy` are routed and linked from the footer, but their copy only
  exists in Shopify admin and has not been brought over.
- **The Jizan branch pin may be wrong.** The theme linked it by place
  name rather than coordinates, and the name in the query is a general
  contracting firm, not FCEC. The query is kept verbatim in
  `src/content/footer.js`; worth checking the pin lands on the office.
- **`footer_address1_paragraph` was never set.** The theme's Contact
  column rendered it into an empty `<p>`, so the live footer has no head
  office address. The port shows the email and both phone numbers there
  instead; add an address if one is wanted.
- **`footer_headings_text_1..4` are now unused.** The theme's quick links
  were a shorter copy of the main menu, missing About and Careers. The
  footer uses `PRIMARY_NAV`, so those four keys have no reader.
- **The Tasneef logo has a stray empty box in it.** A thin-bordered
  rectangle sits beside the Arabic subtitle in `media-src/accreditation/22.png`,
  almost certainly an empty text frame left in the export. It is part of
  the artwork, so it survives the trim and shows on the card. Needs a
  clean file from whoever holds the original.
- **AIT's flag on the live site is Australian.** The Austrian Institute of
  Technology is Austrian, and the port flies Austria. Still wrong on fcec.sa.
- **Partners are not linked.** No partner URLs exist in the theme settings, so
  the cards are static. Add `href` to the entries in
  `src/content/partners.js` and the wall can take the Services hover.
- **The Jeddah showcase image is a logo, and a small one.** 476x303, where
  the other two slides are 1672 and 1920 wide. It is set to `fit: 'contain'`
  in `src/content/projects.js` so it is neither cropped nor upscaled, but a
  showcase slide wants a project visual — a render, a plan, a site
  photograph. Replace `public/spotlight/jeddah-investment-agency.png` and
  switch `fit` to `'cover'`.
- **The valley slide has burnt-in English text.** "IDENTIFYING VALLEY AND
  REEF SANCTITIES..." is part of the image, so it stays English on the Arabic
  site and sits near our own caption. A clean export would fix both.
- **Project Arabic needs a native read.** The organisation names are the
  official ones, but the three project titles were translated here and should
  be checked by someone who writes Arabic.
- **"Reef" looks like a mistranslation.** The Arabic is
  "الأودية والشعاب" — valleys and *ravines*. شعاب only means
  coral reefs in a marine context; in a flood-risk study of watercourses it
  is ravines. The English title on the live site reads "Valley and Reef".
- **The About loop is stock footage.** A generic 3D circuit board, with
  nothing to do with surveying, geomatics or urban planning. It is the
  weakest thing on the homepage; project photography or survey/drone footage
  would carry the section far better.
- **DNS stays where it is.** `fcec.sa` runs on `ns10.dnetns.com` /
  `ns11.dnetns.com`, with mail on Microsoft 365. Pointing it at Vercel is an
  A/CNAME change at the current provider — the nameservers do not move, so
  mail is untouched.
- **No light logo.** The header goes transparent over the hero, where the dark
  blue logo relies on a drop shadow to stay legible. A white version would be
  better; drop it in as `src/assets/brand/fcec-logo-light.png`.
- **Dev-store URLs in production.** Several settings link to
  `themedevops.myshopify.com` rather than `fcec.sa`.
- **Admin-only content.** Contact and the legal pages rendered
  `{{ page.content }}`, which was never in the theme export. That copy has to
  come off the live site, in both locales.
- **Careers vacancies.** The old page fetched `/api/open-positions`, which
  returns nothing. Careers is static until we pick a source.
