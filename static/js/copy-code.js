// Add copy button to all code blocks with event delegation
(function() {
  'use strict';

  // Constants
  const SELECTORS = {
    CODE_BLOCK: '.highlight',
    COPY_BUTTON: '.copy-code-button',
    CODE: 'pre code, pre'
  };

  const CLASSES = {
    WRAPPER: 'code-block-wrapper',
    BUTTON: 'copy-code-button',
    COPIED: 'copied',
    ERROR: 'error'
  };

  const MESSAGES = {
    DEFAULT: 'Copy',
    COPIED: 'Copied!',
    FAILED: 'Copy failed',
    EMPTY: 'Nothing to copy'
  };

  const FEEDBACK_DURATION = 2000;

  // Check clipboard capabilities
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

  // Fallback copy method using execCommand
  const copyWithFallback = (text) => {
    return new Promise((resolve, reject) => {
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
  };

  // Copy text to clipboard
  const copyText = (text) => {
    if (hasClipboardAPI) {
      return navigator.clipboard.writeText(text);
    }

    if (hasExecCommand) {
      return copyWithFallback(text);
    }

    return Promise.reject(new Error('Copy to clipboard is not supported'));
  };

  // Show temporary feedback message
  const showTemporaryMessage = (button, message, className) => {
    button.textContent = message;
    if (className) {
      button.classList.add(className);
    }

    setTimeout(() => {
      button.textContent = MESSAGES.DEFAULT;
      if (className) {
        button.classList.remove(className);
      }
    }, FEEDBACK_DURATION);
  };

  // Initialize code blocks with copy buttons
  const initializeCodeBlocks = () => {
    if (!canCopy) {
      return;
    }

    const codeBlocks = document.querySelectorAll(SELECTORS.CODE_BLOCK);

    codeBlocks.forEach((codeBlock) => {
      // Skip if already wrapped
      if (codeBlock.parentNode.classList.contains(CLASSES.WRAPPER)) {
        return;
      }

      // Create wrapper for positioning
      const wrapper = document.createElement('div');
      wrapper.className = CLASSES.WRAPPER;

      // Wrap the code block
      codeBlock.parentNode.insertBefore(wrapper, codeBlock);
      wrapper.appendChild(codeBlock);

      // Create copy button
      const copyButton = document.createElement('button');
      copyButton.className = CLASSES.BUTTON;
      copyButton.type = 'button';
      copyButton.setAttribute('aria-label', 'Copy code');
      copyButton.setAttribute('aria-live', 'polite');
      copyButton.textContent = MESSAGES.DEFAULT;

      // Insert button before code block
      wrapper.insertBefore(copyButton, codeBlock);
    });
  };

  // Event delegation: Handle all copy button clicks
  const handleCopyClick = (event) => {
    const button = event.target;

    // Check if clicked element is a copy button
    if (!button.matches(SELECTORS.COPY_BUTTON)) {
      return;
    }

    event.preventDefault();

    // Find the code block
    const wrapper = button.closest('.' + CLASSES.WRAPPER);
    if (!wrapper) {
      return;
    }

    const codeBlock = wrapper.querySelector(SELECTORS.CODE_BLOCK);
    if (!codeBlock) {
      return;
    }

    const code = codeBlock.querySelector(SELECTORS.CODE);
    const textToCopy = code ? code.textContent : '';

    if (!textToCopy) {
      showTemporaryMessage(button, MESSAGES.EMPTY, CLASSES.ERROR);
      return;
    }

    copyText(textToCopy)
      .then(() => {
        showTemporaryMessage(button, MESSAGES.COPIED, CLASSES.COPIED);
      })
      .catch(() => {
        showTemporaryMessage(button, MESSAGES.FAILED, CLASSES.ERROR);
      });
  };

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initializeCodeBlocks();

    // Event delegation: Single event listener for all copy buttons
    document.body.addEventListener('click', handleCopyClick);
  });
})();
