---
title: Scope-basiertes Try/Catch in Power Automate
date: 2026-07-12
tag: Power Automate
excerpt: Ein sehr kurzer Platzhalter-Post, damit die Blog-Logik sichtbar funktioniert.
---

## Warum Scope-basiert?

Mit einem klaren **Try/Catch**-Pattern in Scopes trennst du Fachlogik von Fehlerbehandlung.

### Mini-Pattern

1. Scope `Try` mit eigentlicher Fachlogik
2. Scope `Catch` mit `run after` auf `has failed`, `has timed out`, `has skipped`
3. Fehlertext mit `coalesce(...)` für Notification oder Logging

```text
coalesce(outputs('HTTP')?['body/error/message'], outputs('HTTP')?['body/message'], 'Unbekannter Fehler')
```

Dieser Beitrag ist ein Platzhalter und kann spaeter frei erweitert werden.
