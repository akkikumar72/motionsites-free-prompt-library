---
name: browser-e2e
description: Test this app end to end in a real browser using the agent-browser CLI. Use when asked to e2e test, smoke test, visually verify, screenshot, or explore the running app beyond what the Playwright suite covers — e.g. "check the live preview works", "click through the catalogue", "screenshot the backgrounds page".
allowed-tools: Bash(npx agent-browser:*), Bash(agent-browser:*), Bash(npm run build:*), Bash(npm run preview:*), Bash(npm run dev:*), Bash(curl:*)
---

# Browser e2e testing with agent-browser

Drive the app in a real Chromium via the `agent-browser` CLI (installed as a
devDependency). Snapshots return an accessibility tree with `@eN` refs you can
click/fill directly — no test code needed.

Before your first command, read the tool's own guide (ships version-matched
with the CLI): `npx agent-browser skills get core`. For systematic
explore-and-find-bugs sessions, also load `npx agent-browser skills get dogfood`.

## 1. Serve the app

Production-like (same server the Playwright suite uses):

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4173 &   # serves http://127.0.0.1:4173
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:4173/   # expect 200
```

For iterating on uncommitted changes use `npm run dev` (port 5173) instead —
no rebuild needed between edits.

## 2. Drive it

```bash
npx agent-browser open http://127.0.0.1:4173/
npx agent-browser snapshot -i          # interactive elements with @eN refs
npx agent-browser click @e13           # act on a ref
npx agent-browser snapshot -i          # re-snapshot after every page change
npx agent-browser screenshot out.png
npx agent-browser close                # always close when done
```

The browser session persists across separate Bash invocations, but refs go
stale whenever the page changes — re-snapshot before reusing them.

If the environment has no bundled Chrome download (sandboxes, CI), point the
CLI at an existing binary before the first command:

```bash
export AGENT_BROWSER_EXECUTABLE_PATH=/opt/pw-browsers/chromium   # Claude Code web sandbox
# or: --executable-path <path> per command
```

## 3. App-specific gotchas (learned the hard way)

- **This is an SPA (react-router).** `wait --url "**/preview/**"` does NOT
  reliably catch client-side pushState navigations — it can time out even
  though the route changed. After clicking a link, verify with
  `get url` or `wait --text "<expected content>"` instead.
- **Cards live below the fold.** The home and catalogue pages have a tall
  hero; prompt cards are off-screen at first. `scrollintoview <sel>` (or
  `scroll down 1000`) before clicking, and remember off-screen elements may
  be missing from `snapshot -i`.
- **Copy buttons** use `navigator.clipboard`, which headless Chromium may
  block. Assert the button label flips to "Copied" rather than reading the
  clipboard.
- **Remote media** (mux/Supabase preview videos) may be unreachable in
  sandboxes. Broken posters/videos fall back to CSS gradients by design —
  don't report that as a bug unless the fallback itself fails.

## 4. Smoke-test checklist

A minimal pass that covers every route:

| Route | Verify |
|---|---|
| `/` | Hero heading renders; featured prompt grid appears after scrolling |
| `/landing-pages` | Search box filters cards (try "solar"); category chips and pagination work |
| `/preview/<slug>` | Click a card/preview link from the catalogue; heading matches the prompt title; Copy Prompt flips to "Copied" |
| `/backgrounds` | Media cards render; Copy URL flips to "Copied" |
| `/gradients` | Gradient packs render; Copy CSS flips to "Copied" |
| `/request` | Form renders |

Worked example (catalogue → live preview):

```bash
npx agent-browser open http://127.0.0.1:4173/landing-pages
npx agent-browser wait --load networkidle
npx agent-browser find first "a[href^='/preview/']" click
npx agent-browser wait --text "Copy Prompt"
npx agent-browser get url            # expect /preview/<slug>
npx agent-browser get text h1
npx agent-browser screenshot preview.png
npx agent-browser close
```

Screenshot anything that looks wrong and include the image plus the failing
route in your report. Kill the preview server and `close` the browser when
finished.
