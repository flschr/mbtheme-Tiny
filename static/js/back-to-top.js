// Show/hide back-to-top button based on scroll position
document.addEventListener('DOMContentLoaded', function() {
  const backToTopButton = document.querySelector('.back-to-top');

  if (!backToTopButton) return;

  backToTopButton.classList.add('visible');
  backToTopButton.style.display = 'flex';
  backToTopButton.style.visibility = 'visible';
  backToTopButton.style.opacity = '0.85';

  backToTopButton.addEventListener('click', function (event) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
