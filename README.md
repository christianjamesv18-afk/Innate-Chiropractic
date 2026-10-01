# Innate-Chiropractic
I am VA that works for Dr. Thomas as Chiropractor and Functional Medicine
Can you remove the m dashes please on any responses

## Patient Portal Theme

Branded CSS and JavaScript for the Innate Chiropractic Patient Portal, built from the Innate Chiropractic Brand Guidelines v1.

### Files

| File | Purpose |
| --- | --- |
| `assets/css/innate-portal.css` | All portal styles (colors, fonts, layout, components, phone layout) |
| `assets/js/innate-portal.js` | Portal behavior (mobile menu, tabs, pop ups, alerts, form checks, notifications) |
| `assets/img/innate-logo.png` | Primary logo |
| `assets/img/spine-symbol.png` | Spine symbol (used as the browser tab icon) |
| `index.html` | Sample dashboard showing every component |
| `login.html` | Sample sign in page |

### Brand rules applied

* **Colors:** Blue `#0086CB`, Gray `#C4C4C4`, Black `#000000`, White `#FFFFFF`, with Seafoam as the light accent in gradients.
* **Fonts:** Aileron for headings and buttons (bold italic for big headings, to match the logo), Open Sans for body text.
* **Logo background:** the sidebar uses black, one of the preferred logo backgrounds.
* **Signature graphic:** the diagonal gradient lines appear in page headers (`.ic-diagonals`), section breaks (`.ic-section-break`) and the sign in page.

### Phone version

* Under 1024px wide the sidebar turns into a slide out menu (hamburger button, swipe left or tap outside to close).
* Under 768px wide a bottom tab bar appears, tables turn into stacked cards, pop ups slide up from the bottom, and buttons in pop ups go full width.
* All tap targets are at least 44px, form fields use 16px text so iPhones do not zoom in, and iPhone notch and home bar spacing is respected.

### How to use

Add these two lines to any portal page:

```html
<link rel="stylesheet" href="assets/css/innate-portal.css">
<script src="assets/js/innate-portal.js"></script>
```

Make sure the page has `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` so the phone layout works. Copy markup from `index.html` and `login.html` as a starting point. To show a notification from your own code: `InnatePortal.toast("Saved!", "success")`.
