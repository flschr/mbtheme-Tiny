// Add copy button to all code blocks
document.addEventListener('DOMContentLoaded', function() {
  // Find all code blocks with syntax highlighting
  const codeBlocks = document.querySelectorAll('.highlight');
  const hasClipboardAPI = typeof navigator !== 'undefined' &&
    navigator.clipboard && typeof navigator.clipboard.writeText === 'function';

  let hasExecCommand = false;
  if (typeof document !== 'undefined') {
    if (typeof document.queryCommandSupported === 'function') {
      try {
        hasExecCommand = document.queryCommandSupported('copy');
      } catch (error) {
        hasExecCommand = false;
      }
    }

    if (!hasExecCommand && typeof document.execCommand === 'function') {
      hasExecCommand = true;
    }
  }
  const canCopy = hasClipboardAPI || hasExecCommand;

  function copyWithFallback(text) {
    return new Promise(function(resolve, reject) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);

      const selection = document.getSelection();
      const selectedRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

      textarea.select();

      try {
        const successful = document.execCommand('copy');
        if (!successful) {
          reject(new Error('Copy command was unsuccessful'));
        } else {
          resolve();
        }
      } catch (error) {
        reject(error);
      } finally {
        document.body.removeChild(textarea);

        if (selectedRange && selection) {
          selection.removeAllRanges();
          selection.addRange(selectedRange);
        }
      }
    });
  }

  codeBlocks.forEach(function(codeBlock) {
    if (!canCopy) {
      return;
    }

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
    copyButton.setAttribute('aria-label', 'Copy code');
    copyButton.setAttribute('aria-live', 'polite');
    copyButton.textContent = 'Copy';

    // Insert button before code block
    wrapper.insertBefore(copyButton, codeBlock);

    function showTemporaryMessage(message, className) {
      const originalText = 'Copy';
      copyButton.textContent = message;
      if (className) {
        copyButton.classList.add(className);
      }

      setTimeout(function() {
        copyButton.textContent = originalText;
        if (className) {
          copyButton.classList.remove(className);
        }
      }, 2000);
    }

    function copyText(text) {
      if (hasClipboardAPI) {
        return navigator.clipboard.writeText(text);
      }

      if (hasExecCommand) {
        return copyWithFallback(text);
      }

      return Promise.reject(new Error('Copy to clipboard is not supported'));
    }

    // Add click handler
    copyButton.addEventListener('click', function() {
      const code = codeBlock.querySelector('pre code') || codeBlock.querySelector('pre');
      const textToCopy = code ? code.textContent : '';

      if (!textToCopy) {
        showTemporaryMessage('Nothing to copy', 'error');
        return;
      }

      copyText(textToCopy).then(function() {
        showTemporaryMessage('Copied!', 'copied');
      }).catch(function() {
        showTemporaryMessage('Copy failed', 'error');
      });
    });
  });
});
