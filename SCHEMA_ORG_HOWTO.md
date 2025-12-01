# Search Engine Experimentation (SEE) - Anleitung

Diese Anleitung erklärt, wie du die erweiterten Schema.org Strukturierte Daten Features nutzen kannst, die von Felix' [Search Engine Experimentation Artikel](https://wirres.net/articles/zwischenstand-search-engine-experimentation-see) inspiriert sind.

## Was ist das?

Strukturierte Daten (JSON-LD) helfen Suchmaschinen, deinen Content besser zu verstehen. Das führt zu:
- **Rich Snippets** in Google (Sternchen, Bilder, zusätzliche Infos)
- **Besserer Auffindbarkeit** in spezialisierten Suchen (Rezepte, Videos, Bilder)
- **Maschinenlesbaren Lizenzinformationen** für deine Bilder

## Verfügbare Schema-Typen

### 1. 🍳 Rezepte (Recipe)

Erscheint im **Google Rezept-Karussell** mit Bild, Bewertung und Zubereitungszeit.

**Frontmatter-Beispiel:**

```yaml
---
title: "Gurkensalat nach Omas Rezept"
date: 2025-11-30
photos:
  - "https://example.com/gurkensalat.jpg"
recipe:
  name: "Gurkensalat"
  description: "Frischer Gurkensalat wie bei Oma"
  prepTime: "PT10M"       # 10 Minuten (ISO 8601 Duration)
  cookTime: "PT0M"        # keine Kochzeit
  totalTime: "PT10M"
  recipeYield: "4 Portionen"
  recipeCategory: "Salat"
  recipeCuisine: "Deutsch"
  keywords: "Gurkensalat, Sommer, schnell"
  recipeIngredient:
    - "2 große Gurken"
    - "200ml Sahne"
    - "2 EL Essig"
    - "1 TL Zucker"
    - "Salz und Pfeffer"
  recipeInstructions:
    - "Gurken schälen und in dünne Scheiben schneiden"
    - "Sahne, Essig, Zucker, Salz und Pfeffer vermischen"
    - "Gurkenscheiben mit der Marinade vermengen"
    - "Mindestens 30 Minuten ziehen lassen"
---
```

**Zeit-Formate (ISO 8601 Duration):**
- `PT10M` = 10 Minuten
- `PT1H` = 1 Stunde
- `PT1H30M` = 1 Stunde 30 Minuten

### 2. ⭐ Bewertungen (Review)

Zeigt **Sternchen** in Google-Suchergebnissen an (funktioniert mit `site:` Suche).

**Beispiel: TV-Serie bewerten**

```yaml
---
title: "Plur1bus - Staffel 1"
date: 2025-11-30
rating: 4.5              # Einfache Variante: nur die Bewertung
# ODER ausführlich:
rating:
  value: 4.5
  bestRating: 5
  worstRating: 1
review:
  itemType: "TVSeries"   # Oder: Movie, Book, Product, Place, etc.
  itemName: "Plur1bus"
  itemImage: "https://example.com/pluribus.jpg"
---

Tolle Serie über...
```

**Beispiel: Restaurant/Ort bewerten**

```yaml
---
title: "Denis Pizza Place"
date: 2025-11-30
rating: 5
review:
  itemType: "Place"      # Wichtig für Orte!
  itemName: "Denis Pizza Place"
  address:
    streetAddress: "Hauptstraße 123"
    addressLocality: "Berlin"
    postalCode: "10115"
    addressCountry: "DE"
---

Beste Pizza in Berlin!
```

**Unterstützte itemType Werte:**
- `TVSeries`, `Movie`, `Book`, `Product`
- `Place`, `Restaurant`, `LocalBusiness`
- `CreativeWork`, `Thing` (Fallback)

### 3. 🎬 Videos (VideoObject)

Erscheint im **Google Video-Index** (nur wenn Video Hauptinhalt der Seite ist).

**Beispiel:**

```yaml
---
title: "Mein cooles Video"
date: 2025-11-30
photos:
  - "https://example.com/thumbnail.jpg"  # Wird als thumbnailUrl verwendet
video:
  name: "Titel des Videos"
  description: "Kurze Beschreibung"
  contentUrl: "https://example.com/video.mp4"     # Direkter Link zum Video
  embedUrl: "https://youtube.com/embed/xyz123"    # Embed-URL
  duration: "PT2M30S"                              # 2 Minuten 30 Sekunden
  uploadDate: "2025-11-30T10:00:00+01:00"         # Optional, nutzt sonst .Date
  thumbnailUrl: "https://example.com/thumb.jpg"   # Optional, nutzt sonst .Params.photos
---
```

**Hinweis:** Google ist streng! Videos erscheinen nur im Video-Tab wenn:
- Das Video der Hauptinhalt der Seite ist (nicht nur Beiwerk)
- Die Seite primär für das Video-Viewing optimiert ist

### 4. 📷 Creative Commons Lizenzen (ImageObject)

Markiert deine Bilder als **CC-lizenziert** im Google-Bilder-Index.

**Beispiel:**

```yaml
---
title: "Meine Fotos vom Strand"
date: 2025-11-30
photos:
  - "https://example.com/strand1.jpg"
  - "https://example.com/strand2.jpg"
license:
  url: "https://creativecommons.org/licenses/by-sa/4.0/"
  name: "CC BY-SA 4.0"
  attribution: "Felix Schwenzel"
  notice: "© Felix Schwenzel - CC BY-SA 4.0"
---
```

**Standard-Lizenz** (wenn nur `license: true`)::
- URL: CC BY-SA 4.0
- Attribution: Dein Name aus `.Site.Author.name`

**Beliebte CC-Lizenzen:**
- `https://creativecommons.org/licenses/by/4.0/` (CC BY)
- `https://creativecommons.org/licenses/by-sa/4.0/` (CC BY-SA)
- `https://creativecommons.org/licenses/by-nc/4.0/` (CC BY-NC)
- `https://creativecommons.org/publicdomain/zero/1.0/` (CC0 Public Domain)

## Testen & Validieren

### Google Rich Results Test
https://search.google.com/test/rich-results

Gib deine URL ein und prüfe, ob die strukturierten Daten korrekt sind.

### Schema.org Validator
https://validator.schema.org/

Validiert dein JSON-LD gegen die Schema.org Spezifikation.

### Google Search Console
- Überwache, wie Google deine strukturierten Daten verarbeitet
- Sieh Fehler und Warnungen
- Beobachte die "Erfolge" (Impressionen, Klicks)

## Kombination mehrerer Schema-Typen

Du kannst mehrere Schema-Typen auf einer Seite kombinieren:

```yaml
---
title: "Video-Rezept: Gurkensalat"
date: 2025-11-30
photos:
  - "https://example.com/thumbnail.jpg"
# Rezept Schema
recipe:
  name: "Gurkensalat"
  recipeIngredient:
    - "2 Gurken"
  recipeInstructions:
    - "Gurken schneiden"
# Video Schema
video:
  contentUrl: "https://example.com/rezept.mp4"
  duration: "PT5M"
# CC-Lizenz für Bilder
license:
  url: "https://creativecommons.org/licenses/by/4.0/"
---
```

## Tipps von Felix

1. **Geduld haben**: Google braucht Zeit (Tage bis Wochen), um strukturierte Daten zu erkennen
2. **Nicht für Klicks optimieren**: Es geht darum, mit den Maschinen zu sprechen, nicht um SEO-Hacks
3. **Mit `site:` suchen**: Viele Rich Snippets erscheinen nur bei `site:deine-domain.de` Suchen
4. **Experimentieren**: Nutze deine Seite als Spielwiese, nicht als Business-Optimierung
5. **Langzeit-Experiment**: Sieh es als Notiz für später, zum Vergleichen

## Weitere Ressourcen

- [Google Search Central: Strukturierte Daten](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Schema.org](https://schema.org/)
- [Felix' Original-Artikel](https://wirres.net/articles/zwischenstand-search-engine-experimentation-see)
