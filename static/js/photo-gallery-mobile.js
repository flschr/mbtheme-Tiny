/**
 * Mobile Touch Interaction für Foto-Galerie
 * - Erster Tap: Zeigt Datum und Titel
 * - Zweiter Tap: Navigiert zur Detailseite
 * - Tap außerhalb: Schließt alle offenen Infos
 */

(function() {
  'use strict';

  // Prüfe ob Touch-Device
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice) {
    return; // Auf Desktop nichts machen, Hover funktioniert
  }

  const photoTiles = document.querySelectorAll('.photo-tile');
  let currentlyOpen = null;

  // Handler für Photo-Tap
  function handlePhotoTap(event) {
    const tile = event.currentTarget;

    // Wenn dieses Foto bereits die Infos zeigt -> zweiter Tap -> Navigation erlauben
    if (tile.classList.contains('show-info')) {
      // Kein preventDefault, Link funktioniert normal
      return;
    }

    // Erster Tap -> Infos anzeigen
    event.preventDefault();

    // Schließe alle anderen geöffneten Infos
    if (currentlyOpen && currentlyOpen !== tile) {
      currentlyOpen.classList.remove('show-info');
    }

    // Zeige Infos für dieses Foto
    tile.classList.add('show-info');
    currentlyOpen = tile;
  }

  // Handler für Tap außerhalb
  function handleOutsideTap(event) {
    // Prüfe ob Tap auf ein Photo-Tile war
    const clickedTile = event.target.closest('.photo-tile');

    if (!clickedTile && currentlyOpen) {
      // Tap war außerhalb -> Schließe alle Infos
      currentlyOpen.classList.remove('show-info');
      currentlyOpen = null;
    }
  }

  // Event Listener hinzufügen
  photoTiles.forEach(tile => {
    tile.addEventListener('click', handlePhotoTap);
  });

  // Global listener für Taps außerhalb
  document.addEventListener('click', handleOutsideTap);

})();
