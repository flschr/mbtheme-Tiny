// Show/hide back-to-top button based on scroll position
document.addEventListener('DOMContentLoaded', function() {
  const backToTopButton = document.querySelector('.back-to-top');

  if (!backToTopButton) return;

  backToTopButton.classList.add('visible');
});
