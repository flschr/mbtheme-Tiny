(function() {
  // Alle DOM-Elemente
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearch');
  const tagsContainer = document.getElementById('tagsContainer');
  const yearsContainer = document.getElementById('yearsContainer');
  const toggleTagsBtn = document.getElementById('toggleTags');
  const toggleYearsBtn = document.getElementById('toggleYears');
  const resultsContainer = document.getElementById('resultsContainer');
  const resultsCount = document.getElementById('resultsCount');
  const resultsList = document.getElementById('resultsList');
  const postsData = document.getElementById('postsData');
  const googleSearchLink = document.getElementById('googleSearchLink');
  const googleSearchText = document.getElementById('googleSearchText');

  let selectedTag = undefined;
  let selectedYear = undefined;
  let searchTerm = '';
  let activeFilterType = null; // 'tags' oder 'years'

  // Lade alle Posts
  const allPosts = Array.from(postsData.querySelectorAll('.post-data')).map(el => ({
    title: el.dataset.title,
    titleDisplay: cleanDisplayTitle(el.dataset.titleDisplay),
    date: el.dataset.date,
    year: el.dataset.year,
    dateDisplay: el.dataset.dateDisplay,
    time: el.dataset.time,
    tags: el.dataset.tags,
    url: el.dataset.url
  }));

  function cleanDisplayTitle(title) {
    if (!title) return '';

    let cleaned = title.replace(/\.video-wrapper.*/gi, '');
    cleaned = cleaned.replace(/<(video|iframe|embed|object)[^>]*>.*/gi, '');
    cleaned = cleaned.replace(/\{[^}]*\}/gs, ' ');
    cleaned = cleaned.replace(/\s\.[a-zA-Z0-9_-]+/g, ' ');
    cleaned = cleaned.replace(/^\.+[a-zA-Z0-9_-]+/g, ' ');
    cleaned = cleaned.replace(/#[a-zA-Z0-9_-]+/g, ' ');
    cleaned = cleaned.replace(/[a-zA-Z-]+:\s*[^;]+;/g, ' ');
    cleaned = cleaned.replace(/data-[a-zA-Z-]+="[^"]*"/g, ' ');
    cleaned = cleaned.replace(/\[[^\]]*\]/g, ' ');
    cleaned = cleaned.replace(/<[^>]*>/g, ' ');
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    if (cleaned.length < 3 || /^[\s\W]+$/.test(cleaned)) {
      return '[Artikel ohne Titel]';
    }

    return cleaned;
  }

  // Hilfsfunktion: Schließe andere Filter-Bereiche
  function closeOtherFilters(keepOpen) {
    if (keepOpen !== 'tags') {
      tagsContainer.style.display = 'none';
      toggleTagsBtn.textContent = 'Tags ▼';
    }
    if (keepOpen !== 'years') {
      yearsContainer.style.display = 'none';
      toggleYearsBtn.textContent = 'Jahre ▼';
    }
  }

  // Hilfsfunktion: Reset andere Filter
  function resetOtherFilters(keepActive) {
    if (keepActive !== 'tags') {
      selectedTag = undefined;
      tagsContainer.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('tag-btn-active'));
    }
    if (keepActive !== 'years') {
      selectedYear = undefined;
      yearsContainer.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('tag-btn-active'));
    }
  }

  // Toggle Tags
  toggleTagsBtn.addEventListener('click', function() {
    const willBeVisible = tagsContainer.style.display === 'none';

    if (willBeVisible) {
      closeOtherFilters('tags');
      resetOtherFilters('tags');
      activeFilterType = 'tags';
      tagsContainer.style.display = '';
      toggleTagsBtn.textContent = 'Tags ▲';
      filterAndDisplay();
    } else {
      tagsContainer.style.display = 'none';
      toggleTagsBtn.textContent = 'Tags ▼';
      if (selectedTag === undefined) {
        activeFilterType = null;
      }
    }
  });

  // Toggle Years
  toggleYearsBtn.addEventListener('click', function() {
    const willBeVisible = yearsContainer.style.display === 'none';

    if (willBeVisible) {
      closeOtherFilters('years');
      resetOtherFilters('years');
      activeFilterType = 'years';
      yearsContainer.style.display = '';
      toggleYearsBtn.textContent = 'Jahre ▲';
      filterAndDisplay();
    } else {
      yearsContainer.style.display = 'none';
      toggleYearsBtn.textContent = 'Jahre ▼';
      if (selectedYear === undefined) {
        activeFilterType = null;
      }
    }
  });

  // Tag-Buttons erstellen
  const tagCounts = {};
  let postsWithoutTags = 0;

  allPosts.forEach(post => {
    if (post.tags) {
      post.tags.split(',').forEach(tag => {
        tag = tag.trim();
        if (tag) {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        }
      });
    } else {
      postsWithoutTags++;
    }
  });

  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

  if (sortedTags.length > 0) {
    sortedTags.forEach(([tag, count]) => {
      const btn = document.createElement('a');
      btn.className = 'tag-btn';
      btn.dataset.tag = tag;
      btn.textContent = tag + ' (' + count + ')';
      btn.href = '#';
      tagsContainer.appendChild(btn);
    });

    if (postsWithoutTags > 0) {
      const noTagsBtn = document.createElement('a');
      noTagsBtn.className = 'tag-btn';
      noTagsBtn.dataset.tag = '__NO_TAGS__';
      noTagsBtn.textContent = 'Ohne Tags (' + postsWithoutTags + ')';
      noTagsBtn.href = '#';
      tagsContainer.appendChild(noTagsBtn);
    }
  }

  // Jahr-Buttons erstellen
  const yearCounts = {};
  allPosts.forEach(post => {
    if (post.year) {
      yearCounts[post.year] = (yearCounts[post.year] || 0) + 1;
    }
  });

  const sortedYears = Object.entries(yearCounts).sort((a, b) => b[0].localeCompare(a[0]));

  if (sortedYears.length > 0) {
    sortedYears.forEach(([year, count]) => {
      const btn = document.createElement('a');
      btn.className = 'tag-btn';
      btn.dataset.year = year;
      btn.textContent = year + ' (' + count + ')';
      btn.href = '#';
      yearsContainer.appendChild(btn);
    });
  }

  // Tag-Filter
  tagsContainer.addEventListener('click', function(e) {
    e.preventDefault();
    const btn = e.target.closest('.tag-btn');
    if (btn) {
      const tagValue = btn.dataset.tag;

      // Toggle: Wenn schon aktiv, deaktivieren
      if (btn.classList.contains('tag-btn-active')) {
        btn.classList.remove('tag-btn-active');
        selectedTag = undefined;
        activeFilterType = null;
      } else {
        // Neuen Tag aktivieren
        tagsContainer.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('tag-btn-active'));
        btn.classList.add('tag-btn-active');
        selectedTag = tagValue;
        activeFilterType = 'tags';
      }

      filterAndDisplay();
    }
  });

  // Jahr-Filter
  yearsContainer.addEventListener('click', function(e) {
    e.preventDefault();
    const btn = e.target.closest('.tag-btn');
    if (btn) {
      const yearValue = btn.dataset.year;

      // Toggle: Wenn schon aktiv, deaktivieren
      if (btn.classList.contains('tag-btn-active')) {
        btn.classList.remove('tag-btn-active');
        selectedYear = undefined;
        activeFilterType = null;
      } else {
        // Neues Jahr aktivieren
        yearsContainer.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('tag-btn-active'));
        btn.classList.add('tag-btn-active');
        selectedYear = yearValue;
        activeFilterType = 'years';
      }

      filterAndDisplay();
    }
  });

  // Suche mit Debounce
  let searchTimeout;
  searchInput.addEventListener('input', function() {
    searchTerm = this.value.toLowerCase().trim();
    clearSearchBtn.style.display = searchTerm ? 'block' : 'none';

    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      updateCounts();
      filterAndDisplay();
    }, 300);
  });

  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  });

  // Clear-Button
  clearSearchBtn.addEventListener('click', function() {
    searchInput.value = '';
    searchTerm = '';
    this.style.display = 'none';
    updateCounts();
    filterAndDisplay();
  });

  // Update Counts - zeigt nur Tags/Jahre die Treffer haben
  function updateCounts() {
    const newTagCounts = {};
    const newYearCounts = {};
    let noTagsCount = 0;

    // Zähle basierend auf aktueller Suche (aber nicht auf aktivem Filter)
    allPosts.forEach(post => {
      const matchesSearch = searchTerm === '' || post.title.includes(searchTerm);

      if (matchesSearch) {
        // Zähle Tags
        if (post.tags) {
          post.tags.split(',').forEach(tag => {
            tag = tag.trim();
            if (tag) {
              newTagCounts[tag] = (newTagCounts[tag] || 0) + 1;
            }
          });
        } else {
          noTagsCount++;
        }

        // Zähle Jahre
        if (post.year) {
          newYearCounts[post.year] = (newYearCounts[post.year] || 0) + 1;
        }
      }
    });

    // Update Tag-Buttons
    tagsContainer.querySelectorAll('.tag-btn').forEach(btn => {
      const tag = btn.dataset.tag;

      if (tag === '__NO_TAGS__') {
        btn.textContent = 'Ohne Tags (' + noTagsCount + ')';
        if (noTagsCount === 0) {
          btn.style.display = 'none';
        } else {
          btn.style.display = '';
        }
      } else {
        const count = newTagCounts[tag] || 0;
        btn.textContent = tag + ' (' + count + ')';
        if (count === 0) {
          btn.style.display = 'none';
        } else {
          btn.style.display = '';
        }
      }
    });

    // Update Jahr-Buttons
    yearsContainer.querySelectorAll('.tag-btn').forEach(btn => {
      const year = btn.dataset.year;
      const count = newYearCounts[year] || 0;
      btn.textContent = year + ' (' + count + ')';
      if (count === 0) {
        btn.style.display = 'none';
      } else {
        btn.style.display = '';
      }
    });
  }

  // Filter und Anzeige - ODER-Verknüpfung für Tag/Jahr
  function filterAndDisplay() {
    const filtered = allPosts.filter(post => {
      // Suche kombiniert sich mit allem
      const matchesSearch = searchTerm === '' || post.title.includes(searchTerm);

      // Nur EINER der beiden Filter ist aktiv
      let matchesFilter = true;

      if (activeFilterType === 'tags') {
        if (selectedTag === '__NO_TAGS__') {
          matchesFilter = !post.tags || post.tags.trim() === '';
        } else if (selectedTag !== undefined) {
          matchesFilter = post.tags && post.tags.split(',').map(t => t.trim()).includes(selectedTag);
        }
      } else if (activeFilterType === 'years') {
        if (selectedYear !== undefined) {
          matchesFilter = post.year === selectedYear;
        }
      }

      return matchesSearch && matchesFilter;
    });

    const hasFilters = selectedTag !== undefined || selectedYear !== undefined || searchTerm !== '';

    if (hasFilters) {
      resultsContainer.style.display = '';
      resultsCount.textContent = filtered.length + ' ' + (filtered.length === 1 ? 'Ergebnis' : 'Ergebnisse');

      // Zeige Google-Link nur wenn Suchbegriff vorhanden
      if (searchTerm !== '') {
        googleSearchLink.style.display = 'inline-block';

        let linkText = '';
        if (filtered.length === 0) {
          linkText = 'Keine Treffer? Google durchsucht auch den Artikelinhalt';
        } else if (filtered.length <= 5) {
          linkText = 'Nur ' + filtered.length + ' Treffer? Google durchsucht auch den Artikelinhalt';
        } else if (filtered.length <= 20) {
          linkText = 'Für Volltextsuche: Mit Google suchen';
        } else {
          googleSearchLink.style.display = 'none';
        }

        googleSearchText.textContent = linkText;
        googleSearchLink.href = 'https://www.google.com/search?q=site:fischr.org ' + encodeURIComponent(searchTerm);
      } else {
        googleSearchLink.style.display = 'none';
      }

      resultsList.innerHTML = '';
      filtered.forEach(post => {
        const li = document.createElement('li');
        li.style.marginBottom = '1.5rem';

        const metaLine = document.createElement('div');
        metaLine.style.fontSize = '0.9em';
        metaLine.style.marginBottom = '0.25rem';

        const dateSpan = document.createElement('span');
        dateSpan.textContent = post.dateDisplay;
        metaLine.appendChild(dateSpan);

        if (post.tags) {
          const tagList = post.tags.split(',').map(t => t.trim()).filter(t => t);
          if (tagList.length > 0) {
            const separator = document.createTextNode(' · ');
            metaLine.appendChild(separator);

            tagList.forEach((tag, index) => {
              const tagBtn = document.createElement('a');
              tagBtn.textContent = tag;
              tagBtn.href = '#';
              tagBtn.className = 'result-tag-btn';
              tagBtn.style.display = 'inline-block';
              tagBtn.style.textDecoration = 'none';
              tagBtn.style.padding = '2px 8px';
              tagBtn.style.border = '1px solid var(--link)';
              tagBtn.style.color = 'var(--link)';
              tagBtn.style.borderRadius = '5px';
              tagBtn.style.fontSize = '0.8em';
              tagBtn.style.marginLeft = index === 0 ? '0.25rem' : '0.375rem';
              tagBtn.style.transition = 'all 0.2s';

              tagBtn.addEventListener('click', function(e) {
                e.preventDefault();

                // Schließe andere Filter und öffne Tags
                closeOtherFilters('tags');
                resetOtherFilters('tags');
                tagsContainer.style.display = '';
                toggleTagsBtn.textContent = 'Tags ▲';
                activeFilterType = 'tags';

                tagsContainer.querySelectorAll('.tag-btn').forEach(btn => {
                  if (btn.dataset.tag === tag) {
                    btn.classList.add('tag-btn-active');
                  } else {
                    btn.classList.remove('tag-btn-active');
                  }
                });
                selectedTag = tag;
                filterAndDisplay();
                tagsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              });

              tagBtn.addEventListener('mouseenter', function() {
                this.style.background = 'var(--link)';
                this.style.color = 'var(--button-text)';
              });
              tagBtn.addEventListener('mouseleave', function() {
                this.style.background = '';
                this.style.color = 'var(--link)';
              });

              metaLine.appendChild(tagBtn);
            });
          }
        }

        const link = document.createElement('a');
        link.href = post.url;
        link.textContent = post.titleDisplay;
        link.style.fontSize = '1.1em';

        li.appendChild(metaLine);
        li.appendChild(link);

        resultsList.appendChild(li);
      });
    } else {
      resultsContainer.style.display = 'none';
      googleSearchLink.style.display = 'none';
    }
  }
})();
