// Add copy button to all code blocks
document.addEventListener('DOMContentLoaded', function() {
  // Find all code blocks with syntax highlighting
  const codeBlocks = document.querySelectorAll('.highlight');

  codeBlocks.forEach(function(codeBlock) {
    // Create wrapper for positioning
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';

    // Wrap the code block
    codeBlock.parentNode.insertBefore(wrapper, codeBlock);
    wrapper.appendChild(codeBlock);

    // Create copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-code-button';
    copyButton.type = 'button';
    copyButton.setAttribute('aria-label', 'Code kopieren');
    copyButton.textContent = 'Kopieren';

    // Insert button before code block
    wrapper.insertBefore(copyButton, codeBlock);

    // Add click handler
    copyButton.addEventListener('click', function() {
      // Get the code content
      const code = codeBlock.querySelector('pre code') || codeBlock.querySelector('pre');
      const textToCopy = code.textContent;

      // Copy to clipboard
      navigator.clipboard.writeText(textToCopy).then(function() {
        // Success feedback
        copyButton.textContent = 'Kopiert!';
        copyButton.classList.add('copied');

        // Reset after 2 seconds
        setTimeout(function() {
          copyButton.textContent = 'Kopieren';
          copyButton.classList.remove('copied');
        }, 2000);
      }).catch(function(err) {
        // Fallback for older browsers
        console.error('Copy failed:', err);
        copyButton.textContent = 'Fehler';
        setTimeout(function() {
          copyButton.textContent = 'Kopieren';
        }, 2000);
      });
    });
  });
});
