# Search Engine Experimentation für Micro.blog

Diese Anleitung erklärt, wie du die erweiterten Schema.org Features **mit Micro.blog** nutzt, wo du keinen direkten Zugriff auf Frontmatter hast.

## Wie es funktioniert

Das Theme erkennt automatisch, welche Art von Content du postest, basierend auf:
1. **Tags** die du in Micro.blog setzt
2. **Content-Analyse** (z.B. Sternchen im Text)
3. **Globale Einstellungen** in deiner config.json

## 1. Rezepte (Recipe Schema)

**So aktivierst du es:**
Füge diesen Tag zu deinem Post hinzu:
- `rezeptvomchef` (Haupt-Tag)
- Alternative: `rezept`, `recipe`, `kochen`

**Beispiel-Post:**
```
Gurkensalat nach Omas Rezept 🥒

Zutaten:
- 2 große Gurken
- 200ml Sahne
- 2 EL Essig
- Salz und Pfeffer

Zubereitung:
1. Gurken schälen und in dünne Scheiben schneiden
2. Sahne, Essig und Gewürze vermischen
3. Über die Gurken geben und ziehen lassen

#rezeptvomchef #sommer #schnell
```

Das Theme generiert automatisch Recipe Schema mit:
- Titel als Rezeptname
- Erstes Bild als Recipe-Bild
- Summary als Beschreibung

**Hinweis:** Für detaillierte Rezepte (mit Zeiten, Portionen etc.) brauchst du Frontmatter - aber die Basic-Version funktioniert nur mit dem Tag!

## 2. Bewertungen mit Sternen (Review Schema)

**So aktivierst du es:**

### Option A: Automatische Sternchen-Erkennung
Füge einfach Sternchen zu deinem Post hinzu:

```
Plur1bus - Staffel 1

★★★★★

Absolut sehenswert! Die Serie überzeugt durch...

#serie #tv #review
```

Das Theme zählt die Sternchen automatisch und generiert ein Review Schema mit der entsprechenden Bewertung.

**Beide Stern-Typen funktionieren:**
- ⭐⭐⭐⭐⭐ (gefüllte Sterne)
- ★★★★★ (schwarze Sterne)
- ★★★★☆ (gemischt - zählt nur die gefüllten ★)

### Option B: Review-Tag
Oder nutze einen dieser Tags:
- `review`
- `rezension`
- `bewertung`
- `kritik`

**Automatische Typ-Erkennung:**
Das Theme erkennt automatisch, WAS du bewertest, basierend auf deinen Tags:

| Deine Tags | Review-Typ | Beispiel |
|------------|-----------|----------|
| `film`, `movie`, `kino` | Movie | Kino-Filme |
| `serie`, `tv`, `fernsehen` | TVSeries | TV-Serien |
| `buch`, `book`, `lesen` | Book | Bücher |
| `restaurant`, `essen`, `pizza`, `cafe` | Restaurant | Restaurants, Cafés |
| `laden`, `shop`, `geschäft`, `store` | Store | Läden, Geschäfte |
| `ort`, `place`, `location` | Place | Allgemeine Orte |

**Beispiel: Restaurant-Review**
```
Denis Pizza Place

★★★★★

Beste Pizza in Berlin! Der Teig ist perfekt...

#restaurant #pizza #berlin #review
```

→ Wird automatisch als Restaurant-Review mit 5 Sternen erkannt!

**Beispiel: Laden/Shop-Review**
```
Buchladen am Markt

★★★★☆

Tolle Auswahl, freundliche Beratung!

#laden #bücher #review
```

→ Wird automatisch als Store-Review mit 4 Sternen erkannt!

**Beispiel: Serie-Review**
```
The Mandalorian Staffel 3

⭐⭐⭐⭐

Starker Abschluss der Trilogie...

#serie #tv #starwars #review
```

→ Wird automatisch als TVSeries-Review mit 4 Sternen erkannt!

## 3. Videos (VideoObject Schema)

**So aktivierst du es:**
Füge einen dieser Tags hinzu:
- `video`
- `vlog`

**Beispiel:**
```
Meine neue Kamera im Test

Hier zeige ich euch meine neue Kamera...

[Link zum Video oder eingebettetes Video]

#video #kamera #test
```

**Hinweis:** Google indexiert Videos nur, wenn sie der Hauptinhalt der Seite sind (wie bei YouTube).

## 4. Creative Commons Lizenzen für Bilder

**So aktivierst du es:**

### Option A: Global für alle Bilder (empfohlen)
Füge in deiner `config.json` hinzu:

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

Jetzt werden ALLE Bilder in Posts mit dieser Lizenz markiert!

### Option B: Per Post mit Tag
Füge den Tag `cc` oder `creative-commons` zu Posts hinzu, deren Bilder lizenziert sein sollen:

```
Schöner Sonnenuntergang am Strand

[Foto]

Diese Fotos stehen unter Creative Commons Lizenz.

#fotografie #strand #cc
```

## Kombinationen

Du kannst mehrere Features kombinieren:

**Beispiel: Rezept mit Foto und CC-Lizenz**
```
Omas Gurkensalat 🥒

[Foto vom fertigen Salat]

Zutaten:
- 2 Gurken
- 200ml Sahne
...

#rezept #sommer #cc
```

→ Erzeugt Recipe Schema + ImageObject mit CC-Lizenz!

**Beispiel: Restaurant-Review mit Sternen**
```
Pizzeria Da Mario

⭐⭐⭐⭐

Tolle Pizza, super Ambiente!

#restaurant #pizza #review
```

→ Erzeugt Restaurant-Review mit 4 Sternen!

## Testen

1. **Rich Results Test:** https://search.google.com/test/rich-results
   - Gib deine Post-URL ein
   - Prüfe, ob Schema.org korrekt erkannt wird

2. **Schema Validator:** https://validator.schema.org/
   - Validiert dein JSON-LD

3. **In der Praxis:**
   - Suche auf Google mit `site:deine-domain.de [suchbegriff]`
   - Rich Snippets erscheinen oft nur bei Site-spezifischen Suchen

## Verfügbare Tags - Übersicht

| Feature | Tags |
|---------|------|
| Rezepte | `rezeptvomchef`, `rezept`, `recipe`, `kochen` |
| Reviews | `review`, `rezension`, `bewertung`, `kritik` |
| Videos | `video`, `vlog` |
| CC-Lizenz | `cc`, `creative-commons` |

**Review-Typ-Tags:**
| Typ | Tags |
|-----|------|
| Film | `film`, `movie`, `kino` |
| Serie | `serie`, `tv`, `fernsehen` |
| Buch | `buch`, `book`, `lesen` |
| Restaurant | `restaurant`, `essen`, `pizza`, `cafe` |
| Laden/Shop | `laden`, `shop`, `geschäft`, `store` |
| Ort | `ort`, `place`, `location` |

## Tipps

1. **Sternchen kopieren:**
   - ⭐ (gefüllter Stern) oder
   - ★ (schwarzer Stern) - beide funktionieren!
2. **Tags in Micro.blog:** Schreibe Tags am Ende mit `#tag`
3. **Geduld:** Google braucht Tage/Wochen um strukturierte Daten zu indexieren
4. **Nicht für Klicks optimieren:** Sieh es als Experiment, nicht als SEO-Hack
5. **site: Suche nutzen:** Viele Rich Snippets erscheinen nur bei `site:deine-domain.de` Suchen

## Was ohne Frontmatter nicht geht

Einige erweiterte Features brauchen Frontmatter und sind in Micro.blog nicht nutzbar:
- Detaillierte Rezept-Zeiten (prepTime, cookTime)
- Zutatenlisten und Anweisungen als strukturierte Listen
- Spezifische Video-URLs (contentUrl, embedUrl)
- Restaurant-Adressen für Place-Reviews

**Aber:** Die Basis-Features (Recipe mit Tag, Review mit Sternen, Video mit Tag, CC-Lizenz) funktionieren perfekt!

## Inspiration

Diese Features sind inspiriert von Felix Schwenzels [Search Engine Experimentation Artikel](https://wirres.net/articles/zwischenstand-search-engine-experimentation-see).
