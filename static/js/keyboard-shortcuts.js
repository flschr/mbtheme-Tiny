// Keyboard Shortcuts für bessere Navigation
(function() {
  'use strict';

  let currentPostIndex = -1;
  let posts = [];
  let helpOverlay = null;

  // Initialisierung nach DOM-Load
  document.addEventListener('DOMContentLoaded', function() {
    // Sammle alle Post-Previews auf Listen-Seiten
    posts = Array.from(document.querySelectorAll('.post-preview'));

    // Erstelle Hilfe-Overlay
    createHelpOverlay();

    // Keyboard Event Listener
    document.addEventListener('keydown', handleKeyPress);
  });

  function handleKeyPress(e) {
    // Ignoriere Tastatureingaben in Formularfeldern
    if (e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable) {
      return;
    }

    // Verhindere Standardverhalten für unsere Shortcuts
    const key = e.key.toLowerCase();

    switch(key) {
      case 'j':
        e.preventDefault();
        navigateToNextPost();
        break;

      case 'k':
        e.preventDefault();
        navigateToPreviousPost();
        break;

      case 'n':
        e.preventDefault();
        navigateToPage('next');
        break;

      case 'p':
        e.preventDefault();
        navigateToPage('prev');
        break;

      case 'h':
        e.preventDefault();
        window.location.href = '/';
        break;

      case 't':
        e.preventDefault();
        scrollToTop();
        break;

      case '/':
        e.preventDefault();
        focusSearchField();
        break;

      case '?':
        e.preventDefault();
        toggleHelpOverlay();
        break;

      case 'escape':
        e.preventDefault();
        closeHelpOverlay();
        break;
    }
  }

  // Navigation zwischen Posts auf Listenseiten
  function navigateToNextPost() {
    if (posts.length === 0) return;

    currentPostIndex++;
    if (currentPostIndex >= posts.length) {
      currentPostIndex = posts.length - 1;
      return;
    }

    scrollToPost(currentPostIndex);
  }

  function navigateToPreviousPost() {
    if (posts.length === 0) return;

    currentPostIndex--;
    if (currentPostIndex < 0) {
      currentPostIndex = 0;
      return;
    }

    scrollToPost(currentPostIndex);
  }

  function scrollToPost(index) {
    if (posts[index]) {
      posts[index].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

      // Visuelles Feedback
      highlightPost(posts[index]);
    }
  }

  function highlightPost(post) {
    // Entferne vorherige Highlights
    posts.forEach(p => p.classList.remove('keyboard-focused'));

    // Füge temporäres Highlight hinzu
    post.classList.add('keyboard-focused');

    // Entferne Highlight nach 1 Sekunde
    setTimeout(() => {
      post.classList.remove('keyboard-focused');
    }, 1000);
  }

  // Navigation zwischen Seiten (Pagination)
  function navigateToPage(direction) {
    const nav = document.querySelector('.post-nav');
    if (!nav) return;

    let link;
    if (direction === 'next') {
      link = nav.querySelector('.next a');
    } else if (direction === 'prev') {
      link = nav.querySelector('.prev a');
    }

    if (link) {
      window.location.href = link.href;
    }
  }

  // Scroll nach oben
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Fokus auf Suchfeld
  function focusSearchField() {
    const searchField = document.querySelector('input[type="search"]');
    if (searchField) {
      searchField.focus();
      searchField.select();
    }
  }

  // Hilfe-Overlay erstellen
  function createHelpOverlay() {
    helpOverlay = document.createElement('div');
    helpOverlay.id = 'keyboard-shortcuts-help';
    helpOverlay.className = 'keyboard-help-overlay';
    helpOverlay.setAttribute('role', 'dialog');
    helpOverlay.setAttribute('aria-labelledby', 'shortcuts-title');
    helpOverlay.setAttribute('aria-modal', 'true');

    helpOverlay.innerHTML = `
      <div class="keyboard-help-content">
        <h2 id="shortcuts-title">Tastatur-Shortcuts</h2>
        <button class="keyboard-help-close" aria-label="Schließen">&times;</button>

        <div class="shortcuts-grid">
          <div class="shortcut-section">
            <h3>Navigation</h3>
            <dl>
              <dt><kbd>j</kbd></dt>
              <dd>Nächster Beitrag</dd>

              <dt><kbd>k</kbd></dt>
              <dd>Vorheriger Beitrag</dd>

              <dt><kbd>n</kbd></dt>
              <dd>Nächste Seite</dd>

              <dt><kbd>p</kbd></dt>
              <dd>Vorherige Seite</dd>

              <dt><kbd>h</kbd></dt>
              <dd>Zur Startseite</dd>
            </dl>
          </div>

          <div class="shortcut-section">
            <h3>Aktionen</h3>
            <dl>
              <dt><kbd>t</kbd></dt>
              <dd>Nach oben scrollen</dd>

              <dt><kbd>/</kbd></dt>
              <dd>Suche fokussieren</dd>

              <dt><kbd>?</kbd></dt>
              <dd>Diese Hilfe anzeigen</dd>

              <dt><kbd>Esc</kbd></dt>
              <dd>Hilfe schließen</dd>
            </dl>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(helpOverlay);

    // Close Button Event
    const closeBtn = helpOverlay.querySelector('.keyboard-help-close');
    closeBtn.addEventListener('click', closeHelpOverlay);

    // Click außerhalb schließt Overlay
    helpOverlay.addEventListener('click', function(e) {
      if (e.target === helpOverlay) {
        closeHelpOverlay();
      }
    });
  }

  function toggleHelpOverlay() {
    if (helpOverlay.style.display === 'flex') {
      closeHelpOverlay();
    } else {
      openHelpOverlay();
    }
  }

  function openHelpOverlay() {
    helpOverlay.style.display = 'flex';
    helpOverlay.querySelector('.keyboard-help-close').focus();
  }

  function closeHelpOverlay() {
    helpOverlay.style.display = 'none';
  }
})();
