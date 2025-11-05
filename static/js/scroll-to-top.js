/**
 * Scroll-to-Top Button
 * Shows button after scrolling down 20px with progress indicator
 */

(function() {
  'use strict';

  const scrollButton = document.getElementById('myBtn');

  if (!scrollButton) {
    return;
  }

  /**
   * Scrolls to the top of the page using shared utility
   */
  function scrollToTop() {
    if (window.utils && window.utils.scrollToTop) {
      window.utils.scrollToTop(scrollButton);
    } else {
      // Fallback if utils.js is not loaded
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      scrollButton.blur();
    }
  }

  /**
   * Updates button visibility and progress indicator based on scroll position
   */
  function updateScrollButton() {
    const docElement = document.documentElement;
    const body = document.body;
    const scrollTop = docElement.scrollTop || body.scrollTop;
    const docHeight = docElement.scrollHeight - docElement.clientHeight;

    // Update progress indicator
    if (docHeight > 0) {
      const progress = Math.min((scrollTop / docHeight) * 100, 100);
      scrollButton.style.setProperty('--scroll-progress', `${progress}%`);
    } else {
      scrollButton.style.setProperty('--scroll-progress', '100%');
    }

    // Show/hide button based on scroll position
    if (scrollTop > 20) {
      scrollButton.style.display = 'flex';
    } else {
      scrollButton.style.display = 'none';
      scrollButton.blur();
    }
  }

  // Event listeners
  scrollButton.addEventListener('click', scrollToTop);
  window.addEventListener('scroll', updateScrollButton, { passive: true });

  // Initial state
  updateScrollButton();
})();
