# Search Engine Experimentation - Micro.blog Anleitung

Einfache Anleitung für strukturierte Daten in Micro.blog.

## Was du brauchst

Nur **Tags** in deinen Posts. Keine komplizierten Einstellungen.

---

## 1. 🍳 Rezepte

**Tag:** `#rezeptvomchef`

**Beispiel:**
```
Omas Gurkensalat

Zutaten:
- 2 Gurken
- 200ml Sahne
- Essig, Salz, Pfeffer

Zubereitung:
1. Gurken schneiden
2. Mit Sahne vermischen
3. Ziehen lassen

#rezeptvomchef
```

→ Google kann es im Rezept-Karussell anzeigen

---

## 2. ⭐ Bewertungen (Reviews)

**Was du schreibst:**
- Sternchen: ★★★★★ oder ⭐⭐⭐⭐⭐
- Tag: `#review`
- Typ-Tag: `#film`, `#serie`, `#buch` oder `#ort`

**Sternchen zum Kopieren:**
- ★ (schwarzer Stern)
- ⭐ (gefüllter Stern)

### Beispiel: Film

```
The Matrix

★★★★★

Legendärer Film!

#film #review
```

### Beispiel: Serie

```
The Mandalorian

⭐⭐⭐⭐

Tolle Serie!

#serie #review
```

### Beispiel: Buch

```
Der Hobbit

★★★★★

Klassiker!

#buch #review
```

### Beispiel: Restaurant/Laden/Ort

```
Pizza Luigi

★★★★★

Beste Pizza in Berlin!

#restaurant #ort #review
```

```
Buchladen am Markt

★★★★☆

Große Auswahl!

#laden #ort #review
```

**Hinweis:** Bei Orten ist egal ob Restaurant, Laden, Park, etc. - nutze einfach `#ort` oder spezifischer `#restaurant` / `#laden`.

---

## 3. 📷 CC-Lizenz für Fotos

**Option A: Global für alle Fotos**

In deiner Micro.blog Config:
```json
{
  "params": {
    "license": {
      "url": "https://creativecommons.org/licenses/by-sa/4.0/",
      "name": "CC BY-SA 4.0"
    }
  }
}
```

**Option B: Pro Post**

Füge den Tag `#cc` hinzu:
```
Sonnenuntergang am Strand

[Foto]

#fotografie #cc
```

→ Google erkennt deine Bilder als CC-lizenziert

---

## Tag-Übersicht

| Was | Tag | Beispiel |
|-----|-----|----------|
| Rezept | `#rezeptvomchef` | Gurkensalat |
| Film-Review | `#film #review` + ★★★★★ | The Matrix |
| Serien-Review | `#serie #review` + ★★★★★ | The Mandalorian |
| Buch-Review | `#buch #review` + ★★★★★ | Der Hobbit |
| Ort-Review | `#ort #review` + ★★★★★ | Restaurant, Laden, Park |
| CC-Lizenz | `#cc` | Für einzelne Posts |

**Alternative Ort-Tags:**
- `#restaurant` (für Restaurants/Cafés)
- `#laden` oder `#shop` (für Geschäfte)
- `#ort` (für alles andere)

Alle funktionieren gleich, Google versteht es als "Ort" (Place).

---

## Testen

**Google Rich Results Test:**
https://search.google.com/test/rich-results

1. Post erstellen mit Tags
2. URL in Test eingeben
3. Schauen ob Schema erkannt wird

**In Google suchen:**
```
site:deine-domain.de [suchbegriff]
```

Viele Rich Snippets erscheinen nur bei `site:` Suchen.

---

## Tipps

1. **Geduld:** Google braucht Tage/Wochen zum Indexieren
2. **Sternchen:** Nur gefüllte zählen (★ oder ⭐), nicht ☆
3. **Einfach halten:** Tags am Ende, fertig!

---

## Das war's!

**Rezept:** `#rezeptvomchef`
**Review:** Sternchen ★★★★★ + `#review` + `#film` / `#serie` / `#buch` / `#ort`
**CC-Fotos:** `#cc` oder global einstellen

Inspiriert von Felix Schwenzels [Search Engine Experimentation](https://wirres.net/articles/zwischenstand-search-engine-experimentation-see).
