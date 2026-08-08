# Lighthouse Baptist Church — lbc-marion.org

Static website for Lighthouse Baptist Church, 2445 W. Kem Road, Marion, IN 46952.
Replaces the church's Tithe.ly Sites build (assessed 2026-08-08: broken nav link,
empty pages, 7.7s loads, no meta descriptions/sitemap/structured data).

Plain HTML/CSS/JS, no build step. Shared `style.css` + `main.js`; header, mobile nav,
footer, and the coming-soon modal are duplicated identically in every page (change one,
change all, then grep to confirm).

## Pages

`index.html`, `im-new.html`, `beliefs.html`, `gospel.html`, `ministries.html`,
`contact.html`, plus `404.html` (old Tithe.ly URLs like `/about/our-beliefs` will 404
after cutover; the 404 page routes people to the right place). The `hero-options.html`
preview page was deleted once the hero was chosen.

**Removed 2026-08-08 as stale:** `sermons.html` (the church has no known streaming
channel; the old site's YouTube icon pointed at youtube.com's homepage) and
`events.html`. If the calendar is wanted back later, the working Breeze embed was:

```html
<iframe src="https://lighthousebaptistchurch5573.breezechms.com/embed/calendar/grid?size=medium&amp;color=defined&amp;calendars=eyJpdiI6ImhhQ1k3UWJsVWZGSWh2WkNTRUhOTHc9PSIsInZhbHVlIjoiV3ZhOFY5bjJDN1lFZUZaS1dxeFNwZz09IiwibWFjIjoiOTQ1ODA0ZTJlNDIxYzJjMjEwZDdlYWUxYjkxN2E2ZWU4Y2E1ZWFhZjIzYzYwZDVlNzY3MjAzZTBiZDMxYTRjOSJ9" title="Lighthouse Baptist Church calendar"></iframe>
```

## Design decisions (do not "fix" these back)

- **Accent color departures (two of them, both measured):** the logo's sky blue
  `#42a6d7` fails WCAG AA on white (2.74:1), so text-level accents on light
  backgrounds use harbor blue `#2b7cab` (4.59:1 PASS). The same sky blue also fails
  as small text *on the navy hero overlay* (3.11:1), so text on dark uses the lighter
  tint `--accent-sky-light: #8fd3f0` (5.17:1 PASS). Pure `#42a6d7` is reserved for
  large graphics only: wave rules, the service-band top edge, icon fills. See the
  header comment in `style.css`.
- **Hero is a full-bleed photo with the headline centered over it**, using an even
  top-to-bottom navy overlay (`0.78` to `0.86` alpha, `0.82` to `0.90` on mobile).
  Those alphas are set from measured contrast against this photo's pixels, not picked
  by eye: the bright ceiling, walls, and stage lights sit directly behind the centered
  text. Measured worst case over the composited photo plus overlay:

  | | 375px | 1280px | 1600px | needs |
  |---|---|---|---|---|
  | Headline | 10.40:1 | 9.49:1 | 9.43:1 | 3.0:1 |
  | Tagline | 10.98:1 | 10.61:1 | 10.15:1 | 4.5:1 |
  | Eyebrow label | 6.16:1 | 5.86:1 | 6.39:1 | 4.5:1 |

  **Re-measure if the hero photo is swapped.** The numbers depend on the photo's
  pixels, not just the CSS, and the eyebrow label is the tightest of the three. The
  method is in the skill's `design-system.md` (canvas composite of photo plus the live
  computed gradient, sampled across each text element's real bounding box).
- **The service-times band is light (sea-mist with a sky-blue top edge), not navy.**
  With a dark hero directly above it, two adjacent navy blocks read as one mass. The
  hero is now the page's single dominant dark moment above the fold; the footer is the
  other dark anchor. Rhythm is still "banded."
- **Doctrinal statement is verbatim** from the old site (including the "Section 1.02"
  and "(K)(1)" internal references, which come from the church's constitution). Do not
  edit, soften, or paraphrase any of it without the church's written say-so. Only
  changes made: mojibake bytes fixed (curly quotes/nbsp) and one typo the church made
  ("transporation" → "transportation" on the Bus Ministry copy).
- Em dashes in `<title>`/`og:title` (name — location) are correct typography and
  deliberate. None in copy phrasing.
- **Scripture text was never typed from memory.** The 156 tap-to-expand references on
  `beliefs.html` were generated from a complete public-domain KJV dataset
  ([thiagobodruk/bible](https://github.com/thiagobodruk/bible), `json/en_kjv.json`),
  cross-validated verse-by-verse against bible-api.com before anything was written to
  the page (18 single verses checked, 0 mismatches). Two things that source marks with
  braces are handled deliberately: translator marginal notes
  (`{everlasting: Heb. the days of eternity}`) are stripped, and words the translators
  supplied (`{though} thou be little`, italic in printed KJVs) are unwrapped to plain
  text. Three passages are left as plain citations rather than pills because expanding
  them inline is not useful: `Genesis 1-2`, `Revelation 19-22`, and `Leviticus 18:1-30`
  (the cutoff is 16 verses, set in the generator). The generator lives in this session's
  scratchpad, not the repo; regenerating means re-deriving the reference parser, so
  **edit the pills in place rather than re-running a script over them.**

## Integrations (carried over from the old site, all still owned by the church)

| What | Where |
|---|---|
| Giving | `https://give.tithe.ly/?formId=679f686f-5d42-11ee-90fc-1260ab546d11` (nav + footer). Opens in a sized popup via `openGiving()` in `main.js`, so the site stays put and the form runs on Tithe.ly's own origin. The anchors keep `target="_blank"` so a blocked popup or disabled JS still works. |
| Calendar | Breeze embed removed with `events.html`; the iframe snippet is preserved above |
| Member login | `https://lighthousebaptistchurch5573.breezechms.com` (footer) |
| Facebook | `https://www.facebook.com/lbcmarion/` |

## Run locally

```bash
python -m http.server 8146 --directory lbc-website-repo
```

Or `preview_start({name: "lbc"})` from the root launch.json. Before committing:

```bash
python ../site-checks/check_site.py .
```

## Deploy

**Live (staging URL): https://alexharper24.github.io/lbc-website-repo/**
Published 2026-08-08 from `main`/root on GitHub Pages, HTTPS enforced.
Repo: https://github.com/alexharper24/lbc-website-repo (public).
Pushing to `main` redeploys automatically, usually within a minute.

`.nojekyll` is in the repo. **No CNAME file yet** — add it (containing
`www.lbc-marion.org`) only at DNS cutover, otherwise the project URL preview breaks.
Cutover: set custom domain in Pages settings first, then repoint DNS (apex A records
`185.199.108–111.153`, `www` CNAME to `alexharper24.github.io`), Enforce HTTPS after
the cert issues, then the church cancels Tithe.ly **Sites** (Breeze and Tithe.ly
*giving* are separate subscriptions and unaffected).

## Pending (the placeholder list)

1. ~~Pastor photo~~ **Done 2026-08-08.** Alex supplied `pastor-ron-hon.png` (240px
   circular studio crop, clipped round in CSS) and `hon-family.jpg`.
2. **REPLACE THIS — Formspree form ID** (`contact.html`, `action="https://formspree.io/f/YOUR_FORM_ID"`).
   Create the form for `info@lbc-marion.org`; first submission needs a one-time email
   confirmation from that inbox.
3. **Sermons/streaming**: page removed as stale. Revisit only if the church confirms a
   real YouTube channel or livestream, then rebuild a sermons page around it.
4. **Still no exterior photo.** The four photos Alex added (2026-08-08) are all interior
   or people shots. A building exterior and the road sign are the remaining gap, and
   they are what a first-time visitor looks for. The hero still uses the Feb 2020
   `sanctuary-choir.jpg` because at 1400px it is the highest-resolution image available;
   the newer auditorium shots are only 1117px and would upsample in a full-bleed hero.
5. ~~Hero variant~~ **Done.** Full-bleed choir photo, centered text, even overlay.
   Preview page deleted. Swapping the photo means re-running the contrast measurement
   above.
6. **Singles Retreat**: the old site had a broken `/Singles` nav link. Confirm with the
   church whether the retreat still needs a page (currently dropped).
7. **Staff confirmation**: old site listed Pastor Hon + Amber Biven (Admin). Only Pastor
   Hon appears on the site now; add Amber (or a team page) if the church wants it.
8. **Geo coordinates for JSON-LD** (`index.html` Church schema has no `geo` block yet):
   right-click the building on Google Maps and add latitude/longitude.
9. **Google Business Profile**: confirm the church has claimed it; NAP must match the
   site byte for byte: `Lighthouse Baptist Church / 2445 W. Kem Road, Marion, IN 46952 / (765) 384-7572`.
10. **Doctrinal statement sign-off** from the church (migrated verbatim, but they
    should confirm it is current).
11. **Old Twitter link dropped** (twitter.com/lbcmarion, apparently dormant). Confirm
    the church is fine with Facebook-only, or supply a current X/other profile.
