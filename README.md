# Lighthouse Baptist Church — lbc-marion.org

Static website for Lighthouse Baptist Church, 2445 W. Kem Road, Marion, IN 46952.
Replaces the church's Tithe.ly Sites build (assessed 2026-08-08: broken nav link,
empty pages, 7.7s loads, no meta descriptions/sitemap/structured data).

Plain HTML/CSS/JS, no build step. Shared `style.css` + `main.js`; header, mobile nav,
footer, and the coming-soon modal are duplicated identically in every page (change one,
change all, then grep to confirm).

## Pages

`index.html`, `im-new.html`, `beliefs.html`, `gospel.html`, `ministries.html`,
`sermons.html`, `events.html`, `contact.html`, plus `404.html` (old Tithe.ly URLs like
`/about/our-beliefs` will 404 after cutover; the 404 page routes people to the right
place). The `hero-options.html` preview page was deleted once the hero was chosen.

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

## Integrations (carried over from the old site, all still owned by the church)

| What | Where |
|---|---|
| Giving | `https://give.tithe.ly/?formId=679f686f-5d42-11ee-90fc-1260ab546d11` (nav + footer) |
| Calendar | Breeze ChMS grid embed on `events.html` |
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

## Deploy (not yet done)

GitHub Pages under `github.com/alexharper24/lbc-website-repo`, deploy from `main`/root.
`.nojekyll` is in the repo. **No CNAME file yet** — add it (containing
`www.lbc-marion.org`) only at DNS cutover, otherwise the project URL preview breaks.
Cutover: set custom domain in Pages settings first, then repoint DNS (apex A records
`185.199.108–111.153`, `www` CNAME to `alexharper24.github.io`), Enforce HTTPS after
the cert issues, then the church cancels Tithe.ly **Sites** (Breeze and Tithe.ly
*giving* are separate subscriptions and unaffected).

## Pending (the placeholder list)

1. **REPLACE THIS — pastor photo** (`index.html` pastor section has a visible dashed
   placeholder box). Ask the church for a photo of Pastor Hon (or the family).
2. **REPLACE THIS — Formspree form ID** (`contact.html`, `action="https://formspree.io/f/YOUR_FORM_ID"`).
   Create the form for `info@lbc-marion.org`; first submission needs a one-time email
   confirmation from that inbox.
3. **Sermons/streaming answer** (`sermons.html` Watch Online section): does the church
   have a YouTube channel or livestream? Currently links to their Facebook videos page.
   The old site's YouTube icon pointed at youtube.com's homepage, so no channel is known.
4. **Fresh photos**: both site photos are Feb 2020 phone shots of the sanctuary. Need a
   building exterior, the sign, and anything current. Hero Option C is the fallback if
   photos stay weak.
5. ~~Hero variant~~ **Done.** Full-bleed choir photo, centered text, even overlay.
   Preview page deleted. Swapping the photo means re-running the contrast measurement
   above.
6. **Singles Retreat**: the old site had a broken `/Singles` nav link. Confirm with the
   church whether the retreat still needs a page (currently dropped).
7. **Staff confirmation**: old site listed Pastor Hon + Amber Biven (Admin). Team page
   not built yet; add to About/Home if the church wants it.
8. **Geo coordinates for JSON-LD** (`index.html` Church schema has no `geo` block yet):
   right-click the building on Google Maps and add latitude/longitude.
9. **Google Business Profile**: confirm the church has claimed it; NAP must match the
   site byte for byte: `Lighthouse Baptist Church / 2445 W. Kem Road, Marion, IN 46952 / (765) 384-7572`.
10. **Doctrinal statement sign-off** from the church (migrated verbatim, but they
    should confirm it is current).
11. **Old Twitter link dropped** (twitter.com/lbcmarion, apparently dormant). Confirm
    the church is fine with Facebook-only, or supply a current X/other profile.
