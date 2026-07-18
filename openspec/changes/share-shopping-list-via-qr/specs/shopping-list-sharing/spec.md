# shopping-list-sharing

## ADDED Requirements

### Requirement: Share list as QR code

The system SHALL provide a share action on the shopping list page that displays the current unchecked items encoded as a QR code. The QR payload SHALL be self-contained (no URL, no server) and prefixed with a version marker. Checked items SHALL NOT be included.

#### Scenario: Show QR for unchecked items
- **WHEN** the user activates "Teilen" with 3 unchecked and 2 checked items
- **THEN** a QR code encoding exactly the 3 unchecked item texts is displayed, together with a hint how to scan it and a close control

#### Scenario: Nothing to share
- **WHEN** the list has no unchecked items
- **THEN** the share action is unavailable or explains that there is nothing to share

### Requirement: Import list by scanning a QR code

The system SHALL provide a scan action on the shopping list page that opens an in-app camera scanner, decodes a shared QR code, and adds the received items to the local list using the existing merge behavior (quantity merging, duplicate skipping). The camera and decoding SHALL run inside the app so imported data is stored in the app's own storage.

#### Scenario: Successful import
- **WHEN** the user scans a valid QR code containing 12 items
- **THEN** the items are merged into the local list, the scanner closes, the camera stops, and a confirmation names the number of items added

#### Scenario: Repeated scan is harmless
- **WHEN** the user scans the same QR code twice
- **THEN** the second scan does not create duplicate items beyond what the merge rules allow

#### Scenario: Foreign or corrupt QR code
- **WHEN** the scanner decodes a QR code that does not carry a valid versioned payload
- **THEN** no items are added and a non-technical error message is shown while scanning can continue or be cancelled

#### Scenario: Camera unavailable
- **WHEN** camera permission is denied or no camera exists
- **THEN** the scanner shows a clear error message with guidance instead of a blank view

### Requirement: Offline and serverless transfer

Sharing and importing SHALL work without any network connectivity and without any server component.

#### Scenario: Radios off
- **WHEN** both devices are offline (airplane mode, Wi-Fi off)
- **THEN** showing the QR on one device and scanning it on the other still transfers the items

### Requirement: Accessible sharing UI

The share view and scanner modal SHALL meet WCAG 2.2 AA: keyboard operable, visible focus indicators, focus trapped in the modal and returned on close, Escape closes, controls labeled, scanner status announced via a live region, and the video preview hidden from assistive technology.

#### Scenario: Keyboard-only use
- **WHEN** a keyboard user opens the scanner modal
- **THEN** focus moves into the modal, Tab cycles within it, Escape closes it, and focus returns to the triggering control

#### Scenario: Screen reader feedback
- **WHEN** a scan succeeds or fails while a screen reader is active
- **THEN** the status change is announced without the user moving focus
