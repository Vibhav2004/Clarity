# CLARITY — Pure HTML/CSS/JS Edition

A premium SaaS goal-roadmap app converted from React to vanilla web. **Each page has its own dedicated `.html`, `.css`, and `.js` file.** A tiny shared theme (`shared/theme.css`) and store (`shared/store.js`) are imported by each page so the design system and `localStorage` data layer stay consistent without duplication.

## Pages

| Page                      | HTML                  | CSS                  | JS                  |
| ------------------------- | --------------------- | -------------------- | ------------------- |
| Landing                   | `index.html`          | `index.css`          | `index.js`          |
| Sign in                   | `login.html`          | `login.css`          | `login.js`          |
| Register                  | `register.html`       | `register.css`       | `register.js`       |
| Dashboard                 | `dashboard.html`      | `dashboard.css`      | `dashboard.js`      |
| New roadmap wizard        | `new-roadmap.html`    | `new-roadmap.css`    | `new-roadmap.js`    |
| Roadmap canvas + tracking | `roadmap.html`        | `roadmap.css`        | `roadmap.js`        |
| Custom visual builder     | `custom.html`         | `custom.css`         | `custom.js`         |
| Custom step tracker       | `custom-tracker.html` | `custom-tracker.css` | `custom-tracker.js` |
| Settings                  | `settings.html`       | `settings.css`       | `settings.js`       |
| Profile                   | `profile.html`        | `profile.css`        | `profile.js`        |

## How to run

ES modules require an `http://` origin, so:

```bash
cd clarity-html
python3 -m http.server 8000
# open http://localhost:8000
```

Or use any static host (Netlify, GitHub Pages, Vercel — drop the folder in).

## Data

All data persists in `localStorage` under the key `clarity_state_v1`. Reset it in Settings → Danger zone.

## API and Browser Data Help

See [API-DATA-GUIDE.md](API-DATA-GUIDE.md) for the frontend-to-backend endpoint inputs and the local/session storage values used by the app.
