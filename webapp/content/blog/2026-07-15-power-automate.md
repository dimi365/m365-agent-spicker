---
title: Power Automate Patterns für produktive Flows
date: 2026-07-15
tag: Power Automate
excerpt: Error Handling, HTTP-Trigger, Expressions, Connection References sowie Retry- und Concurrency-Patterns für produktive Flows.
---

# Power Automate

Error-Handling-Patterns, Expressions und HTTP-Trigger-Architekturen — die Patterns, die in echten Projekten den Unterschied machen.

> Stand: Juli 2026 · Vor Produktivnutzung gegen aktuelle Microsoft-Doku prüfen.

---

## Error Handling: Try/Catch/Finally mit Scopes

Das Grundgerüst für jeden produktiven Flow:

```
Scope_Try      → eigentliche Logik
Scope_Catch    → Run after: has failed, is skipped, has timed out
Scope_Finally  → Run after: alle Zustände (optional)
```

Fehlerdetails aus dem Try-Scope ziehen mit `result()`:

```
result('Scope_Try')
```

Liefert ein Array aller Action-Ergebnisse. Auf Fehler filtern (Filter-Array-Action):

```
@filter(result('Scope_Try'), or(equals(item()?['status'], 'Failed'), equals(item()?['status'], 'TimedOut')))
```

### Coalesce-Kette für Fehlermeldungen

HTTP-Connector-Fehler und Systemfehler legen die Message an unterschiedlichen Stellen ab. Eine Coalesce-Kette deckt beide Fälle ab:

```
coalesce(
  item()?['outputs']?['body']?['error']?['message'],
  item()?['error']?['message'],
  item()?['outputs']?['statusCode'],
  'Unknown error'
)
```

Beim Einbau in HTML-Mails in `string()` wrappen — sonst knallt es bei numerischen Status-Codes.

### Fehlermail-Pattern

1. Filter-Array über `result('Scope_Try')` (nur Failed/TimedOut)
2. Apply to each → HTML-Tabellenzeilen bauen: `item()?['name']`, Status, Fehlermeldung (Coalesce-Kette), `item()?['startTime']`
3. Compose: komplettes HTML
4. Mail senden — inkl. Flow-Name und Run-URL:

```
concat('https://make.powerautomate.com/environments/',
  workflow()?['tags']?['environmentName'],
  '/flows/', workflow()?['name'],
  '/runs/', workflow()?['run']?['name'])
```

---

## HTTP-Trigger-Flows (externe Formulare)

Token-basiertes Pattern für Formulare ohne Lizenz beim externen Nutzer:

- Trigger: «When an HTTP request is received» — mit Trigger-Conditions einschränken
- **Token-Check als allererste Action**, bei ungültigem Token sofort 401 zurückgeben
- Token = GUID, ausgestellt vom Einladungs-Flow, in Dataverse gespeichert mit Ablaufdatum + Used-Flag
- Validierung mit **einem** List rows (Top 1, Filter auf Token AND statuscode) — niemals loopen
- HTML zurückgeben via Response-Action: Status 200, Header `Content-Type: text/html`

**Anti-Pattern:** Secrets in der Flow-Definition. Gehören in Environment Variables (Typ Secret / Azure Key Vault).

---

## Expression-Gotchas

Flow-Expressions sind **WDL** (Workflow Definition Language), nicht Power Fx. Nicht mischen.

| Bedarf | Expression |
|---|---|
| Null-sicherer Zugriff | `triggerBody()?['data']?['field']` |
| Empty-Check | `empty(coalesce(x, ''))` |
| Schweizer Datum | `formatDateTime(convertTimeZone(utcNow(), 'UTC', 'W. Europe Standard Time'), 'dd.MM.yyyy')` |
| String → Zahl | `int()` / `float()` — crasht bei leer, mit `if(empty(...))` absichern |
| Select-Output indexieren | `outputs('Select')?['body']?[0]` |

`Select` kennt keinen Item-Index. Für positionsbasierte Joins: Select über `range(0, length(items))` laufen lassen und das Quell-Array indexieren: `variables('arr')?[item()]`.

---

## Connection References

- `ConnectionAuthorizationFailed` nach Import: Connection Reference existiert, ist aber nicht gebunden. Fix: Solution → Connection Reference → Verbindung wählen, oder per Deployment Settings JSON beim Import mitgeben.
- Eine Connection Reference pro Connector pro Solution. Keine impliziten `_upgrade`-Duplikate zulassen — immer mit denselben logischen Namen importieren.
- Produktiv-Flows laufen auf **Service-Account-Verbindungen**. Persönliche Owner-Verbindungen sind ein Audit-Finding.

---

## Retry & Concurrency

- Default-Retry: 4× exponentiell. Für idempotente HTTP-Calls okay. Für «Create record»: Retry auf «None» **oder** Create idempotent machen (Upsert über Alternate Key) — sonst Duplikate.
- «Apply to each» hat Default-Concurrency 20 — das zerlegt Variable-Increments. Bei `Set variable` im Loop: Concurrency auf 1, oder besser gleich Compose/Select statt Variablen.