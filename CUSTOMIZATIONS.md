# Retained Field Notes customizations

Source: https://github.com/madhusudhanraman/madhusudhanraman.github.io

This is an inventory of features in that source, not an exhaustive diff against
an identified upstream Minimal Mistakes release. Local theme files are retained.

| Feature | Implementation |
| --- | --- |
| Custom skin architecture and coordinated backgrounds, text, links, footer and code colors | `_sass/my-skin.scss`; new teal accents replace oxide red |
| 16px base text, justified paragraphs, hyphenation, non-italic blockquotes | `_sass/custom.scss` |
| Desktop table-of-contents placement | `_sass/custom.scss` |
| Small superscript references, desktop floating footnotes, mobile footnotes | `_sass/custom.scss`, `assets/js/footnotes.js`, `_includes/footer/custom.html` |
| MathJax 4, inline/display math, AMS numbering, custom Young diagrams/tableaux and line thickness | `_includes/head/custom.html`, `_sass/custom.scss` |
| Month tabs, note counts, responsive note cards, excerpts and collection description styles | `_pages/notes.md`, `assets/js/notes.js`, `_sass/custom.scss` |
| Book cover grid, writer labels, review cover placement | `_pages/books.md`, `_layouts/single.html`, `_sass/custom.scss` |
| Movie poster grid, review posters, director/cast metadata | `_pages/movies.md`, `_layouts/single.html`, `_includes/page__meta.html` |
| Profile sidebar, academic icon support and configurable links | `_includes/author-profile.html`, `_includes/head/custom.html` |
| Session-persistent rotating biographies | `assets/js/random-bio.js`, `_includes/scripts.html`; now per author |
| Light/dark favicons, PNG fallback, Apple touch icon | `_includes/head/custom.html`, retained icon assets |
| Existing local layouts, includes, theme Sass, navigation machinery and scripts | `_layouts`, `_includes`, `_sass`, `assets/js` |

Removed: all source posts, personal/academic page text, named author profiles,
biography quotations, content images, and the personal analytics destination.
The optional GoatCounter integration remains, enabled only by setting
`goatcounter_code` in `_config.yml` to your new account code.

New: contributor registry, coauthor bylines, author directory and per-author archives,
shared empty homepage, GitHub build/deploy workflow and contribution guide.
No example article or fictional author is published.

## Journal styling

Material Journal (https://materialjournal.net/) informs the oversized typographic
masthead, compact navigation bar, strong section rules and editorial columns.
The teal and ivory palette remains. Overrides live in `_sass/journal.scss`;
original reading, mathematics, archive and media features remain available.
