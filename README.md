# My Launch Partner website

Source for the mylaunchpartner.ai pages that run inside GoHighLevel. Each GHL page holds a two-line snippet; the design and content load from this repo, so an update here shows on every page within about 5–10 minutes. No re-pasting in GHL.

## How it fits together

| Path | What it is |
|---|---|
| `loader.js` | The script each GHL page calls. Builds the page from the files below. |
| `assets/mlp.css` | All styles (colors, fonts, layout). Change the look here. |
| `assets/mlp.js` | Menu, dropdown, animations, FAQ, full-width breakout. |
| `partials/nav.html` | Top menu, including the Specialty Industries dropdown. |
| `partials/footer.html` | Footer on every page. |
| `partials/booking.html` | Booking section + GHL calendar. `{{BOOK_SUB}}` is filled from each page's `book-sub` comment. |
| `partials/sprite.svg` | Icon set. |
| `pages/home.html` | Homepage content. |
| `pages/specialty/*.html` | One file per specialty industry page. |
| `pages/privacy-policy.html`, `pages/terms.html` | Legal pages (linked in the footer). |
| `assets/logo.png`, `assets/favicon.png` | Logo (menu) and browser-tab icon. Favicon URL in GHL website settings: `https://mylaunchpartner.github.io/mlp-website/assets/favicon.png` |

## GHL setup (one time per page)

In each GHL page: full-width Section, padding 0 → 1-column Row → **Custom JS/HTML** element → paste that page's snippet. Put the SEO title and description in the page builder's **SEO & AI search optimization** panel (keep titles under 70 characters). Set the live URL in Websites → Pages → ⋮ → Settings → Path; the builder's own "URL Path/Slug" must be something different (e.g. `/home-page-terms-step`) or GHL adds a number to the path.

### `/`

- **SEO title:** My Launch Partner | Full-Stack Growth Agency
- **SEO description:** Campaigns, video, web design and custom CRM operations from one full-stack team.

```html
<div id="mlp-root" data-page="home"></div>
<script src="https://mylaunchpartner.github.io/mlp-website/loader.js"></script>
```

### `/specialty-industries/fitness-coaches`

- **SEO title:** Marketing for Online Fitness Coaches | My Launch Partner
- **SEO description:** Short-form video editing, Meta ads, challenge launches, funnels and client onboarding automations for online fitness coaches.

```html
<div id="mlp-root" data-page="specialty/fitness-coaches"></div>
<script src="https://mylaunchpartner.github.io/mlp-website/loader.js"></script>
```

### `/specialty-industries/gyms-fitness-studios`

- **SEO title:** Marketing for Gyms & Fitness Studios | My Launch Partner
- **SEO description:** Local Meta and Google ads, intro offer funnels, trial follow-up, retention and win-back campaigns for gyms and boutique fitness studios.

```html
<div id="mlp-root" data-page="specialty/gyms-fitness-studios"></div>
<script src="https://mylaunchpartner.github.io/mlp-website/loader.js"></script>
```

### `/specialty-industries/in-person-retreats`

- **SEO title:** Marketing for Retreat Hosts | My Launch Partner
- **SEO description:** Launch campaigns, retreat sales pages, deposit and payment plan funnels, venue video and guest CRM automations for retreat hosts.

```html
<div id="mlp-root" data-page="specialty/in-person-retreats"></div>
<script src="https://mylaunchpartner.github.io/mlp-website/loader.js"></script>
```

### `/specialty-industries/payment-processors`

- **SEO title:** Payment Processor & ISO Marketing | My Launch Partner
- **SEO description:** Merchant lead generation, agent recruiting funnels, underwriting pipelines and CRM for payment processors, ISOs and merchant services agents.

```html
<div id="mlp-root" data-page="specialty/payment-processors"></div>
<script src="https://mylaunchpartner.github.io/mlp-website/loader.js"></script>
```

### `/specialty-industries/ruo-peptides-and-chemicals`

- **SEO title:** RUO Peptide & Research Chemical Marketing | My Launch Partner
- **SEO description:** Compliance-first websites, email and SMS, CRM and creative for research-use-only peptide and chemical suppliers. One full-stack team.

```html
<div id="mlp-root" data-page="specialty/ruo-peptides-and-chemicals"></div>
<script src="https://mylaunchpartner.github.io/mlp-website/loader.js"></script>
```

### `/specialty-industries/waste-management`

- **SEO title:** Waste Management & Dumpster Rental Marketing | My Launch Partner
- **SEO description:** Google Ads, service-area websites, speed-to-lead CRM and video for dumpster rental, junk removal and waste hauling companies.

```html
<div id="mlp-root" data-page="specialty/waste-management"></div>
<script src="https://mylaunchpartner.github.io/mlp-website/loader.js"></script>
```

### `/privacy-policy`

- **SEO title:** Privacy Policy | My Launch Partner
- **SEO description:** How My Launch Partner collects, uses and protects your information, including text message (SMS) terms.

```html
<div id="mlp-root" data-page="privacy-policy"></div>
<script src="https://mylaunchpartner.github.io/mlp-website/loader.js"></script>
```

### `/terms`

- **SEO title:** Terms of Use | My Launch Partner
- **SEO description:** Terms for using mylaunchpartner.ai, including text messaging terms.

```html
<div id="mlp-root" data-page="terms"></div>
<script src="https://mylaunchpartner.github.io/mlp-website/loader.js"></script>
```

## Adding a new page

1. Copy a file in `pages/specialty/` and rename it (the file name becomes the `data-page` value).
2. Edit its content and the `<!-- book-sub: … -->` line at the top.
3. Add it to the dropdown in `partials/nav.html` and the list in `partials/footer.html`.
4. Create the GHL page and paste its snippet.

## Notes

- Updates appear within ~5–10 minutes (GitHub Pages caching + the loader's refresh window). Hard-refresh to check sooner.
- The GHL editor canvas doesn't run scripts. Use **Preview** to see pages.
- This repo is public (required for free GitHub Pages). Never commit passwords, API keys or private notes.
