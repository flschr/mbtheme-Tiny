/**
 * 404 Page - Automatic Redirect with Countdown
 * Redirects to /random after 6 seconds with visual countdown
 */

(function() {
  'use strict';

  const REDIRECT_DELAY = 6; // seconds
  const REDIRECT_URL = '/random';

  const countdownContainer = document.getElementById('countdown-container');
  const countdownElement = document.getElementById('countdown-value');

  if (!countdownContainer || !countdownElement) {
    return;
  }

  // Show countdown container
  countdownContainer.style.display = 'inline';

  let seconds = REDIRECT_DELAY;
  countdownElement.textContent = seconds;

  const interval = setInterval(() => {
    seconds -= 1;

    if (seconds <= 0) {
      countdownElement.textContent = '0';
      clearInterval(interval);
      window.location.href = REDIRECT_URL;
      return;
    }

    countdownElement.textContent = seconds;
  }, 1000);
})();
