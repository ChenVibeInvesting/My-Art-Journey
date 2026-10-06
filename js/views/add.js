window.AddView = {
  async render(root) {
    let file = null;

    const preview = el('div', { class: 'upload-preview' }, el('span', {}, 'Choose a picture of your drawing'));
    const fileInput = el('input', { type: 'file', accept: 'image/*', id: 'artFile', class: 'visually-hidden' });
    const dateInput = el('input', { type: 'date', id: 'artDate', value: Util.todayISO(), required: true });
    const titleInput = el('input', { type: 'text', id: 'artTitle', maxlength: 80, placeholder: 'Optional' });
    const noteInput = el('textarea', { id: 'artNote', rows: 3, maxlength: 400, placeholder: 'What did you notice today? (optional)' });
    const status = el('p', { class: 'form-status', role: 'status' });
    const saveBtn = el('button', { class: 'btn primary', type: 'submit' }, 'Save to my journey');

    const practiceSelect = PRACTICES.length > 1
      ? el('select', { id: 'artPractice' }, PRACTICES.map(p =>
          el('option', { value: p.id, selected: p.id === Config.currentPracticeId() }, p.name)))
      : null;

    fileInput.addEventListener('change', () => {
      file = fileInput.files[0] || null;
      if (!file) return;
      preview.replaceChildren(el('img', { src: URL.createObjectURL(file), alt: 'Preview of your drawing' }));
    });

    const form = el('form', { class: 'add-form', novalidate: true },
      el('label', { class: 'upload-drop', for: 'artFile' }, preview),
      fileInput,
      el('div', { class: 'fields' },
        el('label', { for: 'artDate' }, 'Date'), dateInput,
        practiceSelect && el('label', { for: 'artPractice' }, 'Drawing practice'),
        practiceSelect,
        el('label', { for: 'artTitle' }, 'Title'), titleInput,
        el('label', { for: 'artNote' }, 'Something I noticed'), noteInput,
        saveBtn, status,
      ),
    );

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!file) { status.textContent = 'Please choose a picture first.'; return; }
      if (!dateInput.value) { status.textContent = 'Please pick a date.'; return; }
      saveBtn.disabled = true;
      status.textContent = 'Saving…';
      try {
        const practiceId = practiceSelect ? practiceSelect.value : PRACTICES[0].id;
        Config.setCurrentPracticeId(practiceId);
        const entry = await ArtStore.add({
          practiceId,
          date: dateInput.value,
          title: titleInput.value.trim(),
          note: noteInput.value.trim(),
          image: await Util.prepareImage(file),
        });
        location.hash = '#journey/' + entry.id;
      } catch (err) {
        console.error(err);
        status.textContent = 'Something went wrong saving. Please try again.';
        saveBtn.disabled = false;
      }
    });

    root.replaceChildren(el('section', { class: 'page add-page' }, el('h1', {}, 'Add My Art'), form));
  },
};
