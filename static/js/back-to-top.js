// Show/hide back-to-top button based on scroll position
document.addEventListener('DOMContentLoaded', function() {
  const backToTopButton = document.querySelector('.back-to-top');

  if (!backToTopButton) return;

  // Show button after scrolling down 300px
  const scrollThreshold = 300;

  window.addEventListener('scroll', function() {
    if (window.scrollY > scrollThreshold) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });
});
