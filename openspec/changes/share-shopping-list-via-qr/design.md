# Design: share-shopping-list-via-qr

## Context

The app is a Vite/React PWA installed to the home screen on an iPad (recipe planning) and an iPhone (shopping). The shopping list is a small JSON array in `localStorage` (`app/src/lib/shopping-list.ts`) with an `addMany` function that already merges quantities of parseable ingredients. There is no server and none is wanted; transfer must work offline.

A browser app on iOS cannot do classic LAN peer-to-peer: no sockets, no mDNS discovery, no Web Bluetooth. The chosen approach transfers the data itself inside a QR code, requiring no network at all.

## Goals / Non-Goals

**Goals:**
- One-shot transfer of unchecked shopping list items from one device to another.
- Fully offline and serverless; works with all radios off.
- Imported data lands in the installed PWA's storage partition (scan happens in-app).
- WCAG 2.2 AA compliant UI for the QR view and the scanner modal.

**Non-Goals:**
- Live/continuous two-way sync (WebRTC) — not needed for the "send list before leaving" flow.
- Transferring checked items, item ids, or checked state — receiver creates fresh items.
- Sharing recipes or anything other than the shopping list.
- AirDrop/Web Share link transfer — rejected due to the Safari-vs-PWA storage-partition split.

## Decisions

### D1: QR carries the data itself (not a URL, not signaling)

The payload IS the list. Alternatives considered:
- *AirDrop link with data in the URL fragment*: opens in Safari, which has a separate storage partition from the installed PWA on iOS — data would land in the wrong list.
- *WebRTC DataChannel with QR signaling*: gives live sync but needs a double QR handshake, SDP compression, and connection-state UI — ~10× complexity for a one-shot need (YAGNI).

### D2: Payload format `recipesmd:v1:<base64(deflate(JSON))>`

- JSON is an array of item text strings — only unchecked items travel; `checked` and `id` are receiver-local concerns.
- Deflate via the native `CompressionStream`/`DecompressionStream` API (Safari 16.4+, fine for current iOS) — no compression library needed.
- The `recipesmd:v1:` prefix lets the scanner reject foreign QR codes and lets future format changes fail gracefully with a clear message instead of corrupt imports.
- Size: a typical list (~30 items × ~30 chars) compresses well under 1 KB → medium-density QR that scans quickly.

### D3: Libraries — `qrcode` for generation, `jsqr` for decoding

- iOS Safari has no `BarcodeDetector`, so decoding needs a JS library; `jsqr` (~40 KB) decodes `ImageData` frames from a `getUserMedia` video stream.
- `qrcode` (~10 KB) renders to a canvas. Both are dependency-free and widely used.

### D4: Import merges via existing `addMany`

No new merge logic. `addMany` already sums quantities of same-name/same-unit unparseable-safe ingredients and skips exact duplicates, so scanning the same QR twice is naturally harmless.

### D5: UI shape — two actions on the shopping list page

- "Teilen": disabled/hidden when there are no unchecked items; opens a view showing the QR large and bright (high contrast helps both scanning and a11y) with a text hint and close button.
- "Scannen": opens a modal dialog containing the live `<video>` preview. Native `<dialog>` or an existing modal pattern with focus trap, Escape to close, visible focus indicators. The video element is `aria-hidden`; status text ("Suche QR-Code…", success, errors) lives in an `aria-live` region.
- On successful decode: stop the camera, close the modal, call `addMany`, and show a confirmation ("N Artikel hinzugefügt") — no silent mutation.
- Camera permission denied or no camera: clear inline error message with guidance, not a dead button.

## Risks / Trade-offs

- [Camera permission is scoped to the PWA and can be revoked] → explicit error state with instructions to re-enable in iOS settings.
- [`CompressionStream` missing on very old Safari] → codec feature-detects and falls back to plain base64 JSON (`recipesmd:v1p:` prefix) — cheap, since payloads are small anyway. *(Decide during implementation whether the fallback is even needed for the two target devices; drop if not — YAGNI.)*
- [Very large lists could exceed comfortable QR density] → cap payload; if over ~2 KB compressed, show a message to clear checked items / shorten the list. Practically unreachable for groceries.
- [jsQR runs per-frame on the main thread] → sample frames at ~10 fps and a reduced canvas size; scanning a screen-displayed QR is high-contrast and tolerant.

## Open Questions

- None blocking. The `CompressionStream` fallback (see Risks) is the only implementation-time judgment call.
