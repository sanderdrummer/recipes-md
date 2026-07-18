# share-shopping-list-via-qr

## Why

The shopping list lives in device-local `localStorage`, so a list built on the iPad (where recipes are planned) cannot reach the iPhone (which goes to the store). There is no server component and none is wanted — transfer must work fully offline between the two devices.

## What Changes

- Add a "Teilen" (share) action on the shopping list page that renders the unchecked items as a QR code containing the compressed list data itself.
- Add a "Scannen" (scan) action on the shopping list page that opens an in-app camera scanner, decodes the QR, and merges the received items into the local list via the existing merge logic (`addMany`).
- Introduce a small versioned payload codec (`recipesmd:v1:<base64(deflate(JSON))>`) so malformed or future-version QRs fail gracefully.
- The scanner runs inside the installed PWA (not the native camera app) so imported data lands in the PWA's storage partition.
- New dependencies: `qrcode` (generation) and `jsQR` (decoding — iOS Safari has no `BarcodeDetector`).

## Capabilities

### New Capabilities

- `shopping-list-sharing`: One-shot, offline, serverless transfer of shopping list items from one device to another via a QR code shown on the sender and scanned inside the app on the receiver.

### Modified Capabilities

<!-- none — existing shopping-list requirements are unchanged; import reuses the existing add/merge behavior -->

## Impact

- `app/src/pages/ShoppingList.tsx`: two new actions (share, scan) plus a QR display view and a scanner modal.
- New lib module for the payload codec (encode/decode + validation), unit-tested.
- `app/package.json`: adds `qrcode` and `jsqr` runtime dependencies (~50 KB combined).
- No changes to storage format, no server, no network requirement (works with radios off).
- A11y: scanner modal and QR view must meet the project's WCAG 2.2 AA rules (focus management, labels, keyboard operability, camera-permission error states).
