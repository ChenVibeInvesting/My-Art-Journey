# My Art Journey

A private, family-use sketchbook site for a child's long-term observational drawing practice (first practice: fish).

## Run it

Open `index.html` in a browser. No install, no build step, no login.

## Where data lives

Artwork and notes are saved in the browser's IndexedDB (this browser, this computer). Clearing site data removes them. Six sample fish drawings are added on first run; open one in the journey and choose **Remove** to delete it.

## Structure

- `js/config.js`: practices (fish today; add flowers, portraits… here) and gentle prompts
- `js/storage.js`: `ArtStore`, the only code that touches storage. Replace with a database/cloud version exposing the same async `list / get / add / remove / count`
- `js/placeholders.js`: sample drawings and first-run seeding
- `js/views/`: Home, Add, Journey, Closer
- `js/modal.js`: large artwork view
- `js/app.js`: hash router

## Next ideas

Export/backup to a file, editing an entry, per-practice themes, more immersive journey layouts.
