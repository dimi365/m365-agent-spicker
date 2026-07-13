# Microsoft 365 Agent-Spicker

Eine kompakte Entscheidungshilfe (Cheat Sheet), welches Microsoft-Werkzeug für
welchen Agent-/Copilot-Use-Case geeignet ist – inklusive verifizierter Grenzwerte
und Hinweise aus der offiziellen Microsoft-Dokumentation.

## Projektstruktur

```
m365-agent-spicker/
├── onepager-standalone/     Schlanke 1-Datei-Version (HTML + CSS inline)
│   └── index.html           → per Doppelklick öffnen, nichts weiter nötig
│
└── webapp/                  Volles Projekt mit getrennter Struktur
    ├── index.html           → Markup
    └── css/
        └── styles.css       → Styles (Fluent-2-inspiriert)
```

## Nutzung

### Variante A – Standalone (am einfachsten)
`onepager-standalone/index.html` doppelklicken → öffnet im Browser.

### Variante B – Webapp
`webapp/index.html` doppelklicken, oder in VS Code mit der Extension
**Live Server** öffnen (Rechtsklick → *Open with Live Server*) für Auto-Reload
beim Bearbeiten.

### Als PDF exportieren
Im Browser `Strg + P` → Ziel **Als PDF speichern** → Layout **Querformat**
(das CSS ist bereits auf A4 quer optimiert).

## Inhaltliche Hinweise

- Werte (Limits, Lizenzanforderungen) sind Stand **13.07.2026** und sollten vor
  Produktivnutzung gegen die aktuelle Microsoft-Dokumentation geprüft werden.
- Quellen: `learn.microsoft.com`, `support.microsoft.com`.
- Korrigiert gegenüber der ersten Fassung: SharePoint Agents nutzen laut
  offizieller FAQ aktuell **keine** Daten aus Listen – List-Knowledge läuft über
  Copilot Studio.
