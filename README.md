# 🔎 Lumen Search

> A lightweight, single-file metasearch engine powered by Cloudflare Workers.

**Lumen** is a minimal, fast, and self-contained search engine that combines results from multiple search providers into one clean interface.

It runs entirely inside a **Cloudflare Worker** — no server, no database, no Wrangler, no npm packages, and no build pipeline required.

Just paste the worker into **Cloudflare Workers & Pages → Edit code → Deploy**.

---

## ✨ Features

* 🔎 **Multi-engine web search**

  * DuckDuckGo
  * Mojeek
  * Brave Search *(optional)*
  * Google Custom Search *(optional)*
  * Wikipedia

* 🖼️ **Image search**

  * DuckDuckGo Images
  * Wikimedia Commons

* 📰 **News search**

  * Google News RSS
  * Bing News RSS

* ⚡ **Instant answers**

  * Calculator
  * Dictionary definitions
  * Weather
  * Wikipedia knowledge cards

* 💡 **Search suggestions**

  * Google
  * DuckDuckGo
  * Wikipedia fallback

* 🎯 **Metasearch ranking**

  * Results from multiple engines are combined using **Reciprocal Rank Fusion (RRF)**.
  * Duplicate URLs are normalized and merged.

* 🚀 **Progressive loading**

  * Fetch additional web results with the **More results** button.

* 🌓 **Dark / light mode**

  * Automatically follows the system theme.
  * Manual theme switching.
  * Preference saved locally.

* 🕘 **Search history**

  * Stores recent searches in `localStorage`.
  * Up to 20 searches.
  * Individual removal or clear-all support.

* ⚡ **Search bangs**

  * Quickly redirect searches to other services.

* 📱 **Responsive UI**

  * Desktop layout
  * Mobile layout
  * Keyboard navigation
  * Accessible focus states

* 🧊 **Caching**

  * In-memory per-isolate cache
  * Cloudflare Cache API
  * Separate TTLs for search and suggestions

* 🔐 **No database required**

  * User search history stays in the browser.
  * API credentials remain server-side as Worker secrets.

---

## 🧱 Architecture

Lumen is intentionally designed as a **single-file Cloudflare Worker**.

```text
                         ┌────────────────────┐
                         │     Lumen UI       │
                         │ HTML/CSS/JS        │
                         └─────────┬──────────┘
                                   │
                                   ▼
                         ┌────────────────────┐
                         │ Cloudflare Worker  │
                         │                    │
                         │ /api/search       │
                         │ /api/suggest      │
                         └─────────┬──────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
              ▼                    ▼                    ▼
       ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
       │ Web Search  │      │ Image Search│      │ News Search │
       └──────┬──────┘      └──────┬──────┘      └──────┬──────┘
              │                    │                    │
       ┌──────┼──────┐       ┌─────┴─────┐       ┌──────┴──────┐
       ▼      ▼      ▼       ▼           ▼       ▼             ▼
      DDG   Mojeek  Brave   DDG       Wikimedia Google News    Bing
                    │
                  Google
                    │
                Wikipedia
```

---

## 🚀 Deployment

### Requirements

You only need:

* A Cloudflare account
* A Cloudflare Worker
* Optional API credentials

You **do not** need:

* Node.js
* npm
* Wrangler
* Git
* A VPS
* A database
* A separate frontend

### 1. Create the Worker

Go to:

**Cloudflare Dashboard → Workers & Pages → Create → Worker**

Open the Worker code editor.

### 2. Paste the code

Replace the default Worker code with the contents of the Lumen Worker.

### 3. Deploy

Click **Deploy**.

That's it.

Your search engine should now be available at your Worker URL:

```text
https://your-worker.your-subdomain.workers.dev
```

---

## 🔑 Optional API Keys

Lumen works without API keys using its public/free search sources.

For additional search coverage, configure these Worker secrets/variables:

| Variable         | Purpose                              | Required |
| ---------------- | ------------------------------------ | -------- |
| `BRAVE_API_KEY`  | Brave Search API                     | No       |
| `GOOGLE_API_KEY` | Google Custom Search API             | No       |
| `GOOGLE_CX`      | Google Programmable Search Engine ID | No       |

Add them under:

**Worker → Settings → Variables and Secrets**

### Without API keys

Lumen can still use:

* DuckDuckGo
* Mojeek
* Wikipedia
* DuckDuckGo Images
* Wikimedia Commons
* Google News
* Bing News
* Dictionary API
* Open-Meteo

This makes the project particularly easy to deploy.

---

## 🔎 Web Search

A normal web search queries multiple engines concurrently.

```text
User query
    │
    ├── DuckDuckGo
    ├── Mojeek
    ├── Brave
    ├── Google
    └── Wikipedia
             │
             ▼
      Result normalization
             │
             ▼
       URL deduplication
             │
             ▼
     Reciprocal Rank Fusion
             │
             ▼
       Lumen results
```

The worker uses `Promise.allSettled()` so one failed search provider does not necessarily break the entire search.

For example, if Brave or Google is unavailable, Lumen can continue using the other providers.

---

## 🧮 Reciprocal Rank Fusion

Lumen uses **Reciprocal Rank Fusion** to combine results from different engines.

The basic scoring model is:

```text
score = weight / (60 + rank)
```

Different providers have different weights:

```js
const weights = {
  brave: 1.2,
  google: 1.2,
  duckduckgo: 1,
  mojeek: 0.9,
  wikipedia: 0.7
};
```

Results appearing highly across multiple engines therefore receive a stronger combined ranking.

---

## 🖼️ Image Search

The image tab combines:

### DuckDuckGo Images

Lumen obtains a DuckDuckGo image token and queries its image endpoint.

### Wikimedia Commons

Lumen also searches Wikimedia Commons for additional results.

The results are merged and deduplicated before being displayed.

The UI includes:

* Lazy-loaded thumbnails
* Image grid
* Full-size image viewer
* Previous / next navigation
* Original source link
* Keyboard navigation

---

## 📰 News Search

News results are collected from:

* Google News RSS
* Bing News RSS

Lumen combines the feeds, removes duplicate headlines, sorts by publication date, and displays the latest results.

---

## ⚡ Instant Answers

Lumen can recognize certain queries before relying entirely on search results.

### Calculator

Examples:

```text
2^10/4
25 * 8
(100 + 50) / 5
```

The calculator uses a custom parser rather than JavaScript `eval()` or `new Function()`.

Supported operators include:

```text
+
-
*
/
%
^
()
```

### Dictionary

Examples:

```text
define serendipity
meaning of velocity
definition of entropy
```

Definitions are retrieved from DictionaryAPI.

### Weather

Examples:

```text
weather in Colombo
weather for London
Tokyo weather
```

Location data comes from Open-Meteo geocoding and current weather data comes from Open-Meteo.

### Wikipedia Cards

Relevant searches can display a Wikipedia knowledge card containing:

* Title
* Description
* Summary
* Image
* Wikipedia link

---

## ⚡ Search Suggestions

Lumen provides autocomplete suggestions while typing.

The suggestion system tries:

```text
Google
   ↓
DuckDuckGo
   ↓
Wikipedia
```

If one provider fails, the next provider is used as a fallback.

---

## 🎯 Search Bangs

Lumen supports quick redirects using `!bang` syntax.

Examples:

```text
!yt lofi
!gh express
!so javascript fetch
!reddit linux
!maps Colombo
!npm react
!mdn WebSocket
```

Supported shortcuts include:

| Bang    | Service        |
| ------- | -------------- |
| `!w`    | Wikipedia      |
| `!yt`   | YouTube        |
| `!gh`   | GitHub         |
| `!so`   | Stack Overflow |
| `!g`    | Google         |
| `!r`    | Reddit         |
| `!maps` | Google Maps    |
| `!a`    | Amazon         |
| `!npm`  | npm            |
| `!mdn`  | MDN            |

You can also place the bang after the query:

```text
linux !gh
```

---

## 🌗 Theme System

Lumen supports light and dark themes.

On first load it checks:

```text
localStorage
      ↓
System prefers-color-scheme
      ↓
Light mode fallback
```

The selected theme is stored locally as:

```text
lumen.theme
```

---

## 🕘 Search History

Search history is stored entirely in the browser using `localStorage`.

The key is:

```text
lumen.hist
```

Lumen stores up to **20 recent searches**.

Users can:

* Reuse previous searches
* Remove individual searches
* Clear all history

No server-side search-history database is required.

---

## 🧊 Caching

Lumen has two cache layers.

### L1 — Worker memory

A `Map()` stores recent results inside the current Worker isolate.

```js
const L1 = new Map();
```

### L2 — Cloudflare Cache API

The Worker also attempts to use:

```text
caches.default
```

This allows cached responses to survive beyond a single request/isolate where Cloudflare's cache behavior permits it.

Default cache durations include:

```text
Search:       10 minutes
Suggestions:  60 minutes
```

---

## 🔐 Security

Lumen includes several basic security protections.

### HTML escaping

User-controlled content is escaped before being inserted into the UI.

### URL validation

External links are restricted to:

```text
http://
https://
```

### API keys

Optional provider API keys are kept inside Worker environment variables instead of being exposed to the browser.

### Response headers

The main page includes:

```text
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer
```

### No `eval()`

The calculator uses a dedicated parser instead of dynamically executing JavaScript.

---

## 📁 Project Structure

There is intentionally almost nothing to manage:

```text
Lumen/
└── worker.js
```

The Worker contains:

```text
HTML
CSS
Frontend JavaScript
API routes
Search engines
Result ranking
Image search
News search
Instant answers
Suggestions
Caching
Cloudflare Worker entrypoint
```

This is deliberate.

**One file. One Worker. Zero build system.**

---

## 🛠️ API Endpoints

### Web / image / news search

```http
GET /api/search?q=QUERY&type=web&page=1
```

Supported types:

```text
web
images
news
```

Example:

```text
/api/search?q=Formula%201&type=web&page=1
```

### Suggestions

```http
GET /api/suggest?q=QUERY
```

Example:

```text
/api/suggest?q=cloudflare
```

### Homepage

```http
GET /
```

---

## 📊 Search Provider Failure Handling

Lumen is designed to be resilient.

If a provider fails:

```text
DuckDuckGo  ✓
Mojeek      ✓
Brave       ✗
Google      ✓
Wikipedia   ✓
```

Lumen can still return results.

The response also exposes provider status so the frontend can indicate when some engines failed.

---

## ⚠️ Limitations

Because Lumen relies partly on publicly accessible search interfaces and third-party APIs:

* Search providers can change their HTML structure.
* Scraping endpoints can introduce rate limits or CAPTCHAs.
* Some providers require API keys.
* Results depend on upstream providers.
* Cloudflare Worker limits still apply.
* Public endpoints may change without notice.
* Image URLs can disappear or reject hotlinking.
* Search quality depends on the underlying providers.

For production deployments with significant traffic, dedicated search APIs are recommended.

---

## 🧩 Why Cloudflare Workers?

Cloudflare Workers make Lumen a good fit for a lightweight search frontend because the entire application can run at the edge.

```text
Browser
   │
   ▼
Cloudflare Edge
   │
   ├── UI
   ├── API
   ├── Search aggregation
   ├── Caching
   └── Provider requests
```

There is no traditional backend server to maintain.

---

## 🧪 Development

The project intentionally avoids a local build system.

There is no:

```text
npm install
npm run build
wrangler deploy
node server.js
```

required for the basic deployment.

Development can simply be done through the Cloudflare Worker editor.

---

## 📜 License

Choose a license that matches how you want others to use the project.

For a permissive open-source project, **MIT** is a straightforward option.

If this repository includes code or assets from third-party projects, APIs, or services, their respective licenses and terms still apply.

---

## 🤝 Contributing

Contributions are welcome.

Some useful areas for improvement:

* Additional search providers
* Better result ranking
* More instant-answer providers
* More search bangs
* Better mobile UX
* Accessibility improvements
* Better provider error handling
* Search filters
* Region/language selection
* More caching strategies
* Optional privacy-focused proxying

---

## ⭐ Philosophy

Lumen is built around a simple idea:

> **Search should be lightweight, fast, and deployable without an entire software stack.**

No framework.

No build pipeline.

No database.

No VPS.

Just a Cloudflare Worker and the web.

---

## 📌 Project Status

**Status:** Active / Experimental

Lumen is suitable for personal deployments, experimentation, lightweight private search portals, and learning how metasearch systems work.

---

### Lumen

**A tiny search engine with a surprisingly large toolbox.** 🔎
