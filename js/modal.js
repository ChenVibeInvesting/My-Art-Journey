// Larger view of one artwork (used by the journey, and reusable elsewhere).
window.ArtModal = {
  // opts: { onChange(): called after a removal, onCompare(entry): optional }
  open(entry, opts = {}) {
    const dlg = document.getElementById('artDialog');
    const close = () => dlg.close();
    let prompt = Util.randomPrompt();
    const promptEl = el('p', { class: 'gentle-prompt' }, prompt);

    dlg.replaceChildren(
      el('button', { class: 'dialog-close', 'aria-label': 'Close', onclick: close }, '×'),
      el('div', { class: 'dialog-art' }, el('img', { src: Util.imageUrl(entry), alt: entry.title || 'Artwork from ' + Util.formatDate(entry.date) })),
      el('div', { class: 'dialog-info' },
        el('p', { class: 'date-label' }, Util.formatDate(entry.date)),
        entry.title && el('h2', {}, entry.title),
        entry.note && el('p', { class: 'note' }, '“' + entry.note + '”'),
        promptEl,
        el('div', { class: 'dialog-actions' },
          el('button', { class: 'btn soft', onclick: () => { prompt = Util.randomPrompt(prompt); promptEl.textContent = prompt; } }, 'Another question'),
          opts.onCompare && el('button', { class: 'btn soft', onclick: () => { close(); opts.onCompare(entry); } }, 'Look closer with another drawing'),
          el('button', {
            class: 'btn quiet',
            onclick: async () => {
              if (!confirm('Remove this drawing from the journey? This cannot be undone.')) return;
              await ArtStore.remove(entry.id);
              close();
              opts.onChange && opts.onChange();
            },
          }, 'Remove'),
        ),
      ),
    );
    if (!dlg.open) dlg.showModal();
  },
};

// Click on the dimmed backdrop closes the dialog.
document.addEventListener('click', e => {
  const dlg = document.getElementById('artDialog');
  if (e.target === dlg) dlg.close();
});
