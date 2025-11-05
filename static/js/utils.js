/**
 * Shared Utility Functions
 * Provides common functionality used across multiple scripts
 */

(function(window) {
  'use strict';

  // Create namespace for utilities
  window.utils = window.utils || {};

  /**
   * Smoothly scrolls to the top of the page
   * @param {HTMLElement} [elementToBlur] - Optional element to blur after scrolling
   */
  window.utils.scrollToTop = function(elementToBlur) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Optionally blur an element (useful for buttons)
    if (elementToBlur && typeof elementToBlur.blur === 'function') {
      elementToBlur.blur();
    }
  };

})(window);
