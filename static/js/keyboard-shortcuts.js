/**
 * Keyboard Shortcuts für bessere Navigation
 *
 * Bietet Tastatur-basierte Navigation für:
 * - Post-Listen (j/k für vor/zurück)
 * - Foto-Galerien (j/k für vor/zurück, n/p für Monate)
 * - Seiten-Navigation (n/p für Pagination)
 * - Utility-Funktionen (h für Home, t für Scroll-to-Top)
 * - Hilfe-Overlay (? zum Anzeigen)
 */
(function() {
  'use strict';

  /* =========================================================================
     STATE MANAGEMENT
     ========================================================================= */

  let currentPostIndex = -1;
  let posts = [];
  let photoTiles = [];
  let monthSections = [];
  let helpOverlay = null;
  let previouslyFocusedElement = null;
  let focusableElements = [];
  let managedPageElements = [];
  let currentPhotoIndex = -1;
  let searchResultsObserver = null;

  /* =========================================================================
     INITIALIZATION
     ========================================================================= */

  document.addEventListener('DOMContentLoaded', () => {
    try {
      refreshPosts();

      // Sammle alle Fotos in der Galerie
      photoTiles = Array.from(document.querySelectorAll('.photo-tile'));
      monthSections = Array.from(document.querySelectorAll('.month-section'));

      // Erstelle Hilfe-Overlay
      createHelpOverlay();

      // Beobachte dynamische Suchresultate
      setupSearchResultsObserver();

      // Keyboard Event Listener
      document.addEventListener('keydown', handleKeyPress);
    } catch (error) {
      console.error('Error initializing keyboard shortcuts:', error);
    }
  });

  const refreshPosts = () => {
    try {
      const previouslyFocusedPost = posts[currentPostIndex] || null;
      const postPreviews = Array.from(document.querySelectorAll('.post-preview'));
      const searchResults = collectSearchResults();
      const uniquePosts = Array.from(new Set([...postPreviews, ...searchResults]));

      posts = uniquePosts;

      if (previouslyFocusedPost) {
        const newIndex = posts.indexOf(previouslyFocusedPost);
        currentPostIndex = newIndex !== -1 ? newIndex : -1;
      } else if (posts.length === 0) {
        currentPostIndex = -1;
      } else if (currentPostIndex >= posts.length) {
        currentPostIndex = posts.length - 1;
      }
    } catch (error) {
      console.error('Error refreshing posts:', error);
    }
  };

  const collectSearchResults = () => {
    try {
      const container = document.querySelector('#search-results');
      if (!container) {
        return [];
      }

      const selectors = [
        '.search-result',
        '.search-hit',
        '.search-item',
        '.search-result-item',
        '.search-results__item',
        '.ais-Hits-item',
        'article',
        'li'
      ];

      let candidates = [];
      for (const selector of selectors) {
        const found = Array.from(container.querySelectorAll(selector));
        if (found.length > 0) {
          candidates = found;
          break;
        }
      }

      if (candidates.length === 0) {
        candidates = Array.from(container.children);
      }

      const candidateSet = new Set(candidates);

      return candidates.filter((element) => {
        if (!(element instanceof HTMLElement)) {
          return false;
        }

        if (element.closest('#search-results') !== container) {
          return false;
        }

        if (element.matches('#search-results')) {
          return false;
        }

        for (const other of candidateSet) {
          if (other !== element && element.contains(other)) {
            return false;
          }
        }

        const hasLink = element.matches('a[href]') || element.querySelector('a[href]');
        const hasContent = element.textContent && element.textContent.trim().length > 0;
        return Boolean(hasLink && hasContent);
      });
    } catch (error) {
      console.error('Error collecting search results:', error);
      return [];
    }
  };

  const setupSearchResultsObserver = () => {
    try {
      const container = document.querySelector('#search-results');
      if (!container || typeof MutationObserver === 'undefined') {
        return;
      }

      if (searchResultsObserver) {
        searchResultsObserver.disconnect();
      }

      searchResultsObserver = new MutationObserver(() => {
        refreshPosts();
      });

      searchResultsObserver.observe(container, {
        childList: true,
        subtree: true
      });

      refreshPosts();
    } catch (error) {
      console.error('Error observing search results:', error);
    }
  };

  /* =========================================================================
     EVENT HANDLERS
     ========================================================================= */

  const handleKeyPress = (e) => {
    try {
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
          if (photoTiles.length > 0) {
            navigateToNextPhoto();
          } else {
            navigateToNextPost();
          }
          break;

        case 'k':
          e.preventDefault();
          if (photoTiles.length > 0) {
            navigateToPreviousPhoto();
          } else {
            navigateToPreviousPost();
          }
          break;

        case 'n':
          e.preventDefault();
          if (photoTiles.length > 0 && navigateToMonth('next')) {
            return;
          }
          navigateToPage('next');
          break;

        case 'p':
          e.preventDefault();
          if (photoTiles.length > 0 && navigateToMonth('prev')) {
            return;
          }
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

        case '?':
          e.preventDefault();
          toggleHelpOverlay();
          break;

        case 'escape':
          e.preventDefault();
          closeHelpOverlay();
          break;
      }
    } catch (error) {
      console.error('Error handling key press:', error);
    }
  };

  /* =========================================================================
     POST NAVIGATION
     ========================================================================= */

  const navigateToNextPost = () => {
    try {
      if (posts.length === 0) return;

      currentPostIndex++;
      if (currentPostIndex >= posts.length) {
        currentPostIndex = posts.length - 1;

        // Versuche beim Erreichen des letzten Beitrags zur nächsten Seite zu wechseln
        if (!navigateToPage('next')) {
          return;
        }

        return;
      }

      scrollToPost(currentPostIndex);
    } catch (error) {
      console.error('Error navigating to next post:', error);
    }
  };

  const navigateToPreviousPost = () => {
    try {
      if (posts.length === 0) return;

      currentPostIndex--;
      if (currentPostIndex < 0) {
        currentPostIndex = 0;
        return;
      }

      scrollToPost(currentPostIndex);
    } catch (error) {
      console.error('Error navigating to previous post:', error);
    }
  };

  /* =========================================================================
     PHOTO NAVIGATION
     ========================================================================= */

  const navigateToNextPhoto = () => {
    try {
      if (photoTiles.length === 0) return;

      currentPhotoIndex++;
      if (currentPhotoIndex >= photoTiles.length) {
        currentPhotoIndex = photoTiles.length - 1;
      }

      scrollToPhoto(currentPhotoIndex);
    } catch (error) {
      console.error('Error navigating to next photo:', error);
    }
  };

  const navigateToPreviousPhoto = () => {
    try {
      if (photoTiles.length === 0) return;

      currentPhotoIndex--;
      if (currentPhotoIndex < 0) {
        currentPhotoIndex = 0;
        return;
      }

      scrollToPhoto(currentPhotoIndex);
    } catch (error) {
      console.error('Error navigating to previous photo:', error);
    }
  };

  const scrollToPost = (index) => {
    try {
      if (posts[index]) {
        posts[index].scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Visuelles Feedback
        highlightPost(posts[index]);
        focusPostElement(posts[index]);
      }
    } catch (error) {
      console.error('Error scrolling to post:', error);
    }
  };

  const scrollToPhoto = (index) => {
    try {
      const tile = photoTiles[index];
      if (tile) {
        tile.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });

        tile.focus({ preventScroll: true });

        highlightPhoto(tile);
      }
    } catch (error) {
      console.error('Error scrolling to photo:', error);
    }
  };

  const highlightPost = (post) => {
    try {
      // Entferne vorherige Highlights
      posts.forEach(p => p.classList.remove('keyboard-focused'));

      // Füge temporäres Highlight hinzu
      post.classList.add('keyboard-focused');

      // Entferne Highlight nach 1 Sekunde
      setTimeout(() => {
        post.classList.remove('keyboard-focused');
      }, 1000);
    } catch (error) {
      console.error('Error highlighting post:', error);
    }
  };

  const focusPostElement = (post) => {
    try {
      if (!post) {
        return;
      }

      const focusableSelector = 'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
      let focusTarget = post.matches(focusableSelector) ? post : post.querySelector(focusableSelector);

      if (!focusTarget) {
        post.setAttribute('tabindex', '-1');
        focusTarget = post;
      }

      if (focusTarget instanceof HTMLElement) {
        focusTarget.focus({ preventScroll: true });
      }
    } catch (error) {
      console.error('Error focusing post element:', error);
    }
  };

  const highlightPhoto = (tile) => {
    try {
      photoTiles.forEach(photo => photo.classList.remove('keyboard-focused'));

      tile.classList.add('keyboard-focused');

      setTimeout(() => {
        tile.classList.remove('keyboard-focused');
      }, 1000);
    } catch (error) {
      console.error('Error highlighting photo:', error);
    }
  };

  /* =========================================================================
     PAGE & MONTH NAVIGATION
     ========================================================================= */

  const navigateToPage = (direction) => {
    try {
      const nav = document.querySelector('.post-nav');
      if (!nav) return false;

      let link;
      if (direction === 'next') {
        link = nav.querySelector('.next a');
      } else if (direction === 'prev') {
        link = nav.querySelector('.prev a');
      }

      if (link) {
        window.location.href = link.href;
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error navigating to page:', error);
      return false;
    }
  };

  const navigateToMonth = (direction) => {
    try {
      if (monthSections.length === 0) {
        return false;
      }

      const activeIndex = getActiveMonthIndex();
      let targetIndex = activeIndex;

      if (direction === 'next' && activeIndex < monthSections.length - 1) {
        targetIndex = activeIndex + 1;
      } else if (direction === 'prev' && activeIndex > 0) {
        targetIndex = activeIndex - 1;
      } else {
        return false;
      }

      const targetSection = monthSections[targetIndex];
      const header = targetSection.querySelector('.month-header');
      const targetElement = header || targetSection;

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }

      const firstTile = targetSection.querySelector('.photo-tile');
      if (firstTile) {
        const tileIndex = photoTiles.indexOf(firstTile);
        if (tileIndex !== -1) {
          currentPhotoIndex = tileIndex;
          firstTile.focus({ preventScroll: true });
          highlightPhoto(firstTile);
        }
      }

      return true;
    } catch (error) {
      console.error('Error navigating to month:', error);
      return false;
    }
  };

  const getActiveMonthIndex = () => {
    try {
      const scrollPosition = window.scrollY;
      let activeIndex = 0;

      monthSections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const offsetTop = rect.top + window.scrollY;

        if (offsetTop - 100 <= scrollPosition) {
          activeIndex = index;
        }
      });

      return activeIndex;
    } catch (error) {
      console.error('Error getting active month index:', error);
      return 0;
    }
  };

  /* =========================================================================
     UTILITY FUNCTIONS
     ========================================================================= */

  const scrollToTop = () => {
    try {
      if (window.utils && window.utils.scrollToTop) {
        window.utils.scrollToTop();
      } else {
        // Fallback if utils.js is not loaded
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    } catch (error) {
      console.error('Error scrolling to top:', error);
    }
  };

  /* =========================================================================
     HELP OVERLAY
     ========================================================================= */

  const createHelpOverlay = () => {
    try {
      helpOverlay = document.createElement('div');
      helpOverlay.id = 'keyboard-shortcuts-help';
      helpOverlay.className = 'keyboard-help-overlay';
      helpOverlay.setAttribute('role', 'dialog');
      helpOverlay.setAttribute('aria-labelledby', 'shortcuts-title');
      helpOverlay.setAttribute('aria-modal', 'true');
      helpOverlay.setAttribute('aria-hidden', 'true');
      helpOverlay.setAttribute('tabindex', '-1');

      helpOverlay.innerHTML = `
        <div class="keyboard-help-content">
          <h2 id="shortcuts-title">Tastatur-Shortcuts</h2>
          <button class="keyboard-help-close" aria-label="Schließen">&times;</button>

          <div class="shortcuts-grid">
            <div class="shortcut-section">
              <h3>Navigation</h3>
              <dl>
                <dt><kbd>j</kbd></dt>
                <dd>Nächster Beitrag/Foto</dd>

                <dt><kbd>k</kbd></dt>
                <dd>Vorheriger Beitrag/Foto</dd>

                <dt><kbd>n</kbd></dt>
                <dd>Nächste Seite/Monat</dd>

                <dt><kbd>p</kbd></dt>
                <dd>Vorherige Seite/Monat</dd>

                <dt><kbd>h</kbd></dt>
                <dd>Zur Startseite</dd>
              </dl>
            </div>

            <div class="shortcut-section">
              <h3>Aktionen</h3>
              <dl>
                <dt><kbd>t</kbd></dt>
                <dd>Nach oben scrollen</dd>

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
      helpOverlay.style.display = 'none';

      // Close Button Event
      const closeBtn = helpOverlay.querySelector('.keyboard-help-close');
      closeBtn.addEventListener('click', closeHelpOverlay);

      // Click außerhalb schließt Overlay
      helpOverlay.addEventListener('click', (e) => {
        if (e.target === helpOverlay) {
          closeHelpOverlay();
        }
      });

      helpOverlay.addEventListener('keydown', trapFocusInsideOverlay);
    } catch (error) {
      console.error('Error creating help overlay:', error);
    }
  };

  const toggleHelpOverlay = () => {
    try {
      if (helpOverlay && helpOverlay.style.display === 'flex') {
        closeHelpOverlay();
      } else {
        openHelpOverlay();
      }
    } catch (error) {
      console.error('Error toggling help overlay:', error);
    }
  };

  const openHelpOverlay = () => {
    try {
      if (!helpOverlay) return;

      previouslyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      updateFocusableElements();
      helpOverlay.style.display = 'flex';
      helpOverlay.setAttribute('aria-hidden', 'false');
      setPageInert(true);
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        helpOverlay.focus();
      }
    } catch (error) {
      console.error('Error opening help overlay:', error);
    }
  };

  const closeHelpOverlay = () => {
    try {
      if (!helpOverlay) return;

      helpOverlay.style.display = 'none';
      helpOverlay.setAttribute('aria-hidden', 'true');
      setPageInert(false);
      if (previouslyFocusedElement) {
        previouslyFocusedElement.focus();
      }
    } catch (error) {
      console.error('Error closing help overlay:', error);
    }
  };

  const updateFocusableElements = () => {
    try {
      if (!helpOverlay) return;

      focusableElements = Array.from(
        helpOverlay.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => {
        return !element.hasAttribute('disabled') && !element.getAttribute('aria-hidden');
      });
    } catch (error) {
      console.error('Error updating focusable elements:', error);
    }
  };

  const trapFocusInsideOverlay = (e) => {
    try {
      if (e.key !== 'Tab') {
        return;
      }

      updateFocusableElements();
      if (focusableElements.length === 0) {
        e.preventDefault();
        helpOverlay.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const isShiftPressed = e.shiftKey;
      const activeElement = document.activeElement;

      if (!isShiftPressed && activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      } else if (isShiftPressed && activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } catch (error) {
      console.error('Error trapping focus:', error);
    }
  };

  const setPageInert = (shouldInert) => {
    try {
      const bodyChildren = Array.from(document.body.children).filter((child) => {
        return child !== helpOverlay;
      });

      if (shouldInert) {
        managedPageElements = bodyChildren.map((child) => {
          const record = {
            element: child,
            hadInert: 'inert' in child ? child.inert : null,
            previousAriaHidden: child.getAttribute('aria-hidden')
          };

          if ('inert' in child) {
            child.inert = true;
          } else {
            child.setAttribute('aria-hidden', 'true');
          }

          return record;
        });
      } else {
        managedPageElements.forEach((record) => {
          const el = record.element;
          if ('inert' in el && record.hadInert !== null) {
            el.inert = record.hadInert;
          }

          if (!('inert' in el)) {
            if (record.previousAriaHidden === null) {
              el.removeAttribute('aria-hidden');
            } else {
              el.setAttribute('aria-hidden', record.previousAriaHidden);
            }
          }
        });
        managedPageElements = [];
      }
    } catch (error) {
      console.error('Error setting page inert:', error);
    }
  };
})();
