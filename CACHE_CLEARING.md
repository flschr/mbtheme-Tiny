# Hugo CSS-Cache Probleme lösen

Wenn Hugo immer noch alte CSS-Dateien verwendet, obwohl du Änderungen vorgenommen hast, folge diesen Schritten:

## 1. Hugo Cache leeren

Hugo cached verarbeitete Ressourcen im `resources` Verzeichnis deines Projekts (nicht im Theme):

```bash
# Im Hauptprojekt (dort wo deine config.json/config.toml ist)
rm -rf resources/
```

## 2. Public Verzeichnis leeren

Leere auch das generierte Public-Verzeichnis:

```bash
# Im Hauptprojekt
rm -rf public/
```

## 3. Hugo neu bauen

Baue die Seite komplett neu:

```bash
hugo --cleanDestinationDir
```

Oder für Micro.blog:

```bash
# Beim Pushen zu Micro.blog wird automatisch neu gebaut
git add .
git commit -m "Force rebuild"
git push
```

## 4. Browser-Cache leeren

Nachdem Hugo neu gebaut wurde:

- **Chrome/Edge**: `Strg+Shift+R` (Windows/Linux) oder `Cmd+Shift+R` (Mac)
- **Firefox**: `Strg+F5` (Windows/Linux) oder `Cmd+Shift+R` (Mac)
- **Safari**: `Cmd+Option+R`

Oder im Browser:
1. Entwicklertools öffnen (F12)
2. Rechtsklick auf Reload-Button
3. "Leeren Cache und harte Aktualisierung" wählen

## 5. Micro.blog spezifisch

Wenn du Micro.blog verwendest:

1. Pushe deine Änderungen zu GitHub
2. Warte, bis Micro.blog den Build abgeschlossen hat
3. Micro.blog nutzt automatisch das Fingerprinting aus dem Theme
4. Lösche den Browser-Cache wie oben beschrieben

## Was wurde im Theme verbessert?

Das Theme verwendet jetzt:

- **SHA256-Fingerprinting**: Jede CSS-Änderung erzeugt eine neue eindeutige URL
- **Integrity-Attribute**: Zusätzliche Sicherheit durch Subresource Integrity
- **Fallback mit Timestamp**: Falls das Fingerprinting nicht funktioniert, wird ein Zeitstempel verwendet

Die CSS-Datei wird automatisch mit einem eindeutigen Hash versehen, z.B.:
```
/css/main.a1b2c3d4.css
```

Sobald du die CSS-Datei änderst, ändert sich der Hash automatisch, und Browser laden die neue Version.

## Prävention

Um zukünftige Cache-Probleme zu vermeiden:

1. Verwende immer `hugo --cleanDestinationDir` beim lokalen Testen
2. Leere regelmäßig den `resources/` Ordner bei größeren Änderungen
3. Teste mit hartem Browser-Reload (Strg+Shift+R)
