# Tasks: share-shopping-list-via-qr

## 1. Payload codec

- [x] 1.1 Add `qrcode` and `jsqr` dependencies to `app/package.json`
- [x] 1.2 Create `app/src/lib/share-codec.ts`: `encodeShare(texts: string[])` / `decodeShare(payload: string)` using `recipesmd:v1:` prefix + base64(deflate(JSON)) via `CompressionStream`; decode rejects foreign/corrupt payloads with a typed error
- [x] 1.3 Unit tests for the codec: round-trip, empty list, corrupt base64, wrong prefix, oversized payload cap

## 2. Share view (sender)

- [x] 2.1 Add "Teilen" action to the shopping list page, unavailable when there are no unchecked items
- [x] 2.2 Render the encoded unchecked items as a high-contrast QR (canvas via `qrcode`) in a dialog with hint text and a labeled close control
- [x] 2.3 A11y pass: dialog semantics, focus trap + return, Escape closes, visible focus indicators, semantic colors only, flat design

## 3. Scanner (receiver)

- [x] 3.1 Add "Scannen" action opening a scanner dialog with `getUserMedia` video preview (`aria-hidden`) and an `aria-live` status region
- [x] 3.2 Frame loop: sample video frames (~10 fps, reduced canvas) through `jsqr`; on valid payload stop camera, close dialog, `addMany` the items, show "N Artikel hinzugefügt" confirmation
- [x] 3.3 Error states: camera permission denied / no camera → guidance message; foreign or corrupt QR → non-technical error, scanning continues
- [x] 3.4 Ensure camera stream is stopped on every exit path (close, Escape, unmount, success)
- [x] 3.5 A11y pass on scanner dialog: focus management, keyboard operability, live-region announcements for success/failure

## 4. Verification

- [x] 4.1 Run typecheck, Biome, and unit tests; fix any findings
- [ ] 4.2 Manual end-to-end check: show QR on one device/browser, scan from the app on another; verify merge, repeat-scan harmlessness, and offline operation
