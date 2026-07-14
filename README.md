# Dimi365 Hub (GitHub Pages)

Home, Themenseiten und Blog auf GitHub Pages.

## Was ist neu?

- `webapp/index.html`: Hub-Startseite mit Themen-Kacheln und den letzten Blogposts.
- `webapp/spicker/index.html`: Live Agent-Spicker Seite.
- `webapp/themen/*.html`: freie Themenseiten als einfache HTML-Placeholders.
- `webapp/content/blog/*.md`: Blogposts als Markdown.
- `webapp/blog/index.html`: Blog-Uebersicht (liest Markdown-Posts aus dem Repo).
- `webapp/blog/post.html`: Detailseite für einzelne Posts.

## Projektstruktur

```
m365-agent-spicker/
└── webapp/
    ├── index.html
    ├── assets/
    │   └── js/
    │       └── blog-data.js
    ├── blog/
    │   ├── index.html
    │   └── post.html
    ├── content/
    │   └── blog/
    │       ├── 2026-07-12-power-automate-try-catch.md
    │       └── 2026-07-08-sharepoint-agent-vs-copilot-studio.md
    ├── spicker/
    │   └── index.html
    ├── themen/
    │   ├── power-automate.html
    │   ├── dataverse.html
    │   └── governance-alm.html
    └── css/
        └── styles.css
```

## Content pflegen

### Neue Blogposts

1. Neue Datei in `webapp/content/blog/` erstellen, z.B. `2026-07-15-mein-post.md`.
2. Frontmatter verwenden:

```md
---
title: Mein Titel
date: 2026-07-15
tag: Copilot Studio
excerpt: Kurzer Teasertext
---

Inhalt in Markdown...
```

3. Commit + Push auf `main`: der Post erscheint automatisch auf Home und Blog.

### Neue Themenseiten

1. Neue HTML-Datei in `webapp/themen/` anlegen.
2. Auf `webapp/index.html` als Kachel verlinken.

## Deployment

- Deployment laeuft via `.github/workflows/deploy-pages.yml`.
- GitHub Pages liefert direkt den Inhalt aus `webapp/` aus.
