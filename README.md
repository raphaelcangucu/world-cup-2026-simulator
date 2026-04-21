# World Cup 2026 Simulator

Static one-page simulator for the official 48-team FIFA World Cup 2026 format, styled for macro.markets.

## Files

- `index.html`
- `styles.css`
- `app.js`
- `third-place-map.json` (official FIFA Annex C combinations for the 8 best third-placed teams)

## Run locally

Use any static server, for example:

```bash
cd world-cup-simulator
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Publish on GitHub Pages

1. Push this folder to a public GitHub repository.
2. In repository settings, enable **GitHub Pages** from the main branch or `/docs`.
3. Use the published URL directly or embed it in the blog via `iframe`/modal.

## Notes

- Group tiebreakers follow the official FIFA order.
- The Round of 32 uses the FIFA 2026 Annex C third-place mapping.
- State is saved in `localStorage` and encoded into the URL hash for sharing.
