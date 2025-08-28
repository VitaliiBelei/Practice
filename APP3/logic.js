(function() {
  'use strict';

  // Cache DOM elements
  const titleEl = document.getElementById('h1');
  const descEl = document.getElementById('p');
  const editBtn = document.getElementById('button');
  const editPanel = document.getElementById('edit');
  const nameInput = document.getElementById('name');
  const historyInput = document.getElementById('History');
  const saveBtn = document.getElementById('button2');

  if (!titleEl || !descEl || !editBtn || !editPanel || !nameInput || !historyInput || !saveBtn) {
    // Required elements not found; abort script safely
    return;
  }

  // Restore saved values if available
  const LS_KEY = 'app3_profile';
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (typeof data?.name === 'string') titleEl.textContent = data.name;
      if (typeof data?.history === 'string') descEl.textContent = data.history;
    }
  } catch (_) {
    // ignore storage errors
  }

  function openEditor() {
    // Prefill with current values
    nameInput.value = titleEl.textContent || '';
    historyInput.value = descEl.textContent || '';
    // Show panel
    editPanel.style.display = 'block';
    // Focus
    setTimeout(() => nameInput.focus(), 0);
  }

  function closeEditor() {
    editPanel.style.display = 'none';
  }

  function saveChanges() {
    const newName = (nameInput.value || '').trim();
    const newHistory = (historyInput.value || '').trim();

    // Basic guard: don't allow both fields to be empty; if so, keep existing
    const finalName = newName || titleEl.textContent;
    const finalHistory = newHistory || descEl.textContent;

    titleEl.textContent = finalName;
    descEl.textContent = finalHistory;

    // Persist
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ name: finalName, history: finalHistory }));
    } catch (_) {
      // ignore
    }

    closeEditor();
  }

  // Event bindings
  editBtn.addEventListener('click', openEditor);
  saveBtn.addEventListener('click', function(e) {
    e.preventDefault();
    saveChanges();
  });

  // Allow Enter to save and Escape to cancel
  editPanel.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && (document.activeElement === nameInput || document.activeElement === historyInput)) {
      e.preventDefault();
      saveChanges();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeEditor();
    }
  });
})();
