# AZX GTM Cockpit

A **static, single-page “GTM cockpit”** built as a **vibe-coded application** for the **AZX GTM AI Engineer** role. It demonstrates how a small go-to-market team could combine **sourced public signals**, an **illustrative pipeline view**, **public ecosystem context**, and a **content queue** without a live CRM, using plain HTML, CSS, JavaScript, and one JSON file.

**Problem this project answers (application prompt):**  
*Create a vibe coded experience that conveys why you're a great fit for this role; send a link and share notes about how you approached it.*

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Data Configuration](#data-configuration)
- [How It Works](#how-it-works)
- [Runtime Behavior](#runtime-behavior)
- [Solution Architecture](#solution-architecture)
- [Deploy to Production](#deploy-to-production)
- [Application Checklist](#application-checklist)
- [Troubleshooting](#troubleshooting)
- [Credits](#credits)
- [License](#license)

---

## Overview

**AZX GTM Cockpit** is a browser-only dashboard that loads **public, verifiable** information from [`data/gtm-data.json`](data/gtm-data.json): links to **azx.io**, **KOMPAS VC**, **GitHub** (e.g. `hpxml-rs`), **LinkedIn**, **Built In**, and the **Vanta Trust Center**. **Pipeline counts** and **ABM “tier” labels** are **explicitly illustrative** (demo UI only); they are not real pipeline or internal ABM scores.

| Panel | Role |
| ----- | ---- |
| **Pipeline snapshot** | Stage-style funnel with placeholder counts + optional “stale deal” style alert (illustrative). |
| **Sourced signals** | Filterable list of external links (investor content, company pages, OSS, hiring). |
| **Strategic ecosystem** | Accounts **named on azx.io/careers** (e.g. CBRE, Franklin Energy, Flexe, Puget Sound Energy) with **demo-only** tier labels. |
| **Content queue** | Draft-style ideas pointing at real URLs (GitHub, careers, KOMPAS articles, Trust Center). |

---

## Key Features

- **Research-backed signals:** Each signal row includes a real `sourceUrl` you can audit in the browser.
- **Illustrative vs. truthy:** Badges call out **illustrative** funnel numbers and **demo** tiers so nothing reads like leaked CRM data.
- **Signal filters:** Chips filter by type (`investor_content`, `company`, `oss`, `hiring`).
- **Responsive layout:** Two-column grid on wide screens; stacks on small screens.
- **Zero build step:** Open standards only; no bundler required for the app itself.
- **Deploy-ready:** GitHub Actions workflow for **GitHub Pages**, plus notes for **Netlify** and **Vercel**.
- **Application copy in JSON:** `applicationNotesForApplicant` holds a short blurb you can paste or shorten for the “how you approached it” field.

---

## Tech Stack

| Layer | Technology |
| ----- | ---------- |
| **Markup / style** | HTML5, CSS3 (custom properties, Google Fonts: Fraunces + Manrope) |
| **Logic** | Vanilla JavaScript (ES modules not required; single `app.js` IIFE) |
| **Data** | Static JSON (`data/gtm-data.json`) |
| **Local dev** | Any static file server (`npx serve`, `python -m http.server`, etc.) |
| **Hosting** | GitHub Pages, Netlify, Vercel, or any static host over **HTTPS** |

---

## Project Structure

```text
azx-gtm-cockpit/
├── data/
│   └── gtm-data.json          # All copy, links, illustrative metrics, suggested application blurb
├── .github/
│   └── workflows/
│       └── pages.yml          # GitHub Actions → GitHub Pages deploy
├── index.html                 # Page shell, font links
├── styles.css                 # Layout, panels, chips, responsive grid
├── app.js                     # fetch JSON, render panels, signal filters
├── netlify.toml               # publish = "." for Git-based Netlify
├── vercel.json                # Static site hints for Vercel
├── .nojekyll                  # Avoid Jekyll processing on GitHub Pages edge cases
├── .gitignore                 # OS / editor / optional node_modules
└── README.md                  # This file
```

---

## Setup Instructions

### Prerequisites

- **Node.js 18+** (optional but recommended for `npx serve`) - [Download Node.js](https://nodejs.org/)
- **Python 3.10+** (optional alternative for `python -m http.server`) - [Download Python](https://www.python.org/downloads/)
- A **modern browser** (Chrome, Edge, Firefox, Safari)
- **Git** (for deploy to GitHub) - [Download Git](https://git-scm.com/downloads)

### Step 1: Clone or copy the repository

```bash
git clone <repository-url>
cd azx-gtm-cockpit
```

(If you are not using Git, unzip the project folder anywhere on disk.)

### Step 2: Run a local static server

**Important:** Do **not** open `index.html` directly from disk (`file://`). The app uses `fetch("data/gtm-data.json")`, which browsers block on `file://` for this pattern.

**Option A - `serve` (Node):**

```bash
npx --yes serve .
```

**Option B - Python:**

```bash
python -m http.server 8080
```

Then open the URL printed in the terminal (e.g. `http://localhost:3000` or `http://localhost:8080`).

### Step 3: Verify

You should see **four panels** loaded from JSON. **Sourced signals** should open external sites in a new tab. The footer should show the disclaimer from `gtm-data.json`.

---

## Environment Variables

**None.** This project does not use API keys, backends, or server-side secrets. All “live” content is **public URLs** embedded in JSON. If you fork this repo, do **not** commit private CRM exports or confidential data into `gtm-data.json`.

---

## Data Configuration

### File: `data/gtm-data.json`

| Key | Purpose |
| --- | ------- |
| `asOf` | Display date in the header. |
| `disclaimer` | Full-width honesty statement (footer). |
| `pipeline` | `illustrative: true`, `stages[]`, optional `alerts[]`. |
| `signals` | `type`, `title`, `date`, `source`, `sourceUrl` (must be real URLs you intend to cite). |
| `strategicFocus` | Public accounts/sectors + `tierDemo` (demo only) + `sourceUrl` (e.g. careers page). |
| `contentQueue` | Draft-style rows with `relatedUrl`. |
| `applicationNotesForApplicant` | Short paragraph for the job form’s “notes / approach” field. |

### Refreshing public facts

Company messaging, investor pages, and third-party URLs change. Before you submit a job application, **re-open each `sourceUrl`** in [`data/gtm-data.json`](data/gtm-data.json) and confirm titles still match what you want to cite.

---

## How It Works

### Page load and render flow

```text
┌─────────────────────────────────────────────────────────────────┐
│  Browser loads index.html + styles.css + app.js                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  app.js: fetch("data/gtm-data.json") over HTTP/HTTPS           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Render four panels:                                           │
│  • Pipeline (illustrative badge)                                │
│  • Signals (filter chips + outbound links)                      │
│  • Strategic ecosystem (demo tier badge)                        │
│  • Content queue (internal links to relatedUrl)                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Footer: disclaimer + applicationNotesForApplicant text          │
└─────────────────────────────────────────────────────────────────┘
```

### Design principles

- **Sourced signals:** Prefer primary or authoritative pages (company site, investor blog, GitHub README, Trust Center).
- **Honest scaffolding:** Anything that looks like CRM metrics is labeled **illustrative** or **demo** in the UI and in this README.
- **Relative URLs:** `fetch("data/gtm-data.json")` resolves correctly on **GitHub Pages project sites** (`/repo-name/`) without a `<base>` tag.

---

## Runtime Behavior

| Behavior | Description |
| -------- | ------------- |
| **JSON load** | Single `GET` to `data/gtm-data.json` (cached with `no-store` for easier local iteration). |
| **Signal filter** | Clicking a chip toggles `aria-pressed` and shows/hides `.signal` rows by `data-type`. |
| **External links** | `target="_blank"` + `rel="noopener noreferrer"` on outbound URLs. |
| **Error state** | If JSON fails to load, a red **error box** explains the usual cause (`file://` or wrong server root). |

There is **no** REST API, WebSocket, or SSE; everything is static.

---

## Solution Architecture

### Problem statement

Show **GTM-oriented thinking** (pipeline, signals, ecosystem, content ops) in a **shippable** artifact that reviewers can open in **under a minute**, with **traceable** public sources and **clear** separation from fake metrics.

### Solution overview

| Decision | Rationale |
| -------- | --------- |
| **Static site** | Fastest path to a public URL; matches “vibe coded” scope. |
| **JSON as source of truth** | Non-engineers can edit copy/links; mirrors how collateral might live in Git. |
| **No backend** | Avoids secrets, hosting complexity, and scope creep for an application exercise. |
| **GitHub Actions for Pages** | Repeatable deploys from `main` with an artifact upload to Pages. |

### Technical challenges addressed

| Challenge | Mitigation |
| --------- | ---------- |
| **`fetch` fails on `file://`** | Document local server commands; error UI explains the fix. |
| **Project Pages base path** | Relative paths for JSON and assets (no hard-coded domain). |
| **Trust / credibility** | Disclaimers + illustrative labels + real links only. |

---

## Deploy to Production

### Option A - GitHub Pages (recommended)

1. Push this repository to GitHub (`main` branch).
2. **Settings → Pages → Build and deployment → Source:** **GitHub Actions** (workflow: [`.github/workflows/pages.yml`](.github/workflows/pages.yml)).
3. After the workflow succeeds, use the published URL, e.g. `https://YOUR_USER.github.io/YOUR_REPO/`.

**Alternative:** Deploy from branch **main** / folder **`/` (root)** without Actions.

### Option B - Netlify

- Drag-and-drop the folder at [Netlify Drop](https://app.netlify.com/drop), **or** connect the repo.  
- Publish directory: **`.`** ([`netlify.toml`](netlify.toml)).

### Option C - Vercel

- Import the repo; framework **Other**; no build command; output **`.`** ([`vercel.json`](vercel.json)).

---

## Application Checklist

- [ ] Public **HTTPS** URL works on mobile and desktop.
- [ ] Every **signal** link opens and still supports your narrative.
- [ ] **Illustrative** pipeline / tiers are clearly labeled in the UI (badges + footer).
- [ ] Paste or adapt **`applicationNotesForApplicant`** into the “how you approached it” field.
- [ ] Proofread for typos (GTM roles notice detail).

---

## Troubleshooting

### Local issues

| Problem | Solution |
| -------- | -------- |
| Blank page or “Could not load data” | You opened `file://`. Run `npx serve .` or `python -m http.server` from the project root. |
| 404 on `gtm-data.json` | Ensure the server root is the folder that **contains** `index.html` and `data/`. |
| Styles missing | Confirm `styles.css` sits next to `index.html` and the `<link>` path is correct. |

### Deploy issues

| Problem | Solution |
| -------- | -------- |
| GitHub Pages 404 | Wait a few minutes; confirm **Pages** source and that `index.html` is at repo root. |
| JSON 404 on Pages | Verify `data/gtm-data.json` is committed: `git ls-files data/gtm-data.json`. |
| Netlify/Vercel wrong directory | Set publish/output to **`.`** (project root), not a subfolder. |

### Content issues

| Problem | Solution |
| -------- | -------- |
| Link rot | Update `title` / `sourceUrl` in `gtm-data.json`; redeploy. |
| Tone too “insider” | Remove or soften any line that could imply non-public deal data. |

---

## Credits

- **Public sources** cited in [`data/gtm-data.json`](data/gtm-data.json) (AZX, KOMPAS VC, GitHub, etc.) belong to their respective owners.
- **Fonts:** [Google Fonts](https://fonts.google.com/): Fraunces, Manrope.

---

## License

MIT License - use this demo project freely for your job search and portfolio. Third-party trademarks and linked content remain property of their owners.
