// "Look Closer": pick any two drawings and see them side by side.
// Neutral by design: positions are just "left" and "right", never before/after.
window.CloserView = {
  async render(root, params = []) {
    const entries = await ArtStore.list(Config.currentPracticeId());

    if (entries.length < 2) {
      root.replaceChildren(el('section', { class: 'page' }, el('h1', {}, 'Look Closer'),
        el('div', { class: 'empty' },
          el('p', {}, 'Add at least two drawings to look at them side by side.'),
          el('a', { class: 'btn primary', href: '#add' }, 'Add My Art'))));
      return;
    }

    // Selected ids, oldest pick first. A third pick replaces the oldest pick.
    let picks = [];
    if (params[0] && entries.some(e => e.id === params[0])) picks.push(params[0]);
    if (!picks.length) picks = [entries[0].id, entries[entries.length - 1].id];

    const stage = el('div', { class: 'compare-stage' });
    const strip = el('div', { class: 'strip', role: 'listbox', 'aria-label': 'Choose two drawings' });
    const prompt = el('p', { class: 'gentle-prompt center big' }, 'What do you notice when you look at these two drawings?');
    const hint = el('p', { class: 'center hint' });

    const byId = id => entries.find(e => e.id === id);

    function draw() {
      // Keep the two chosen drawings in date order on screen, without labelling either one.
      const chosen = picks.map(byId).sort((a, b) => a.date.localeCompare(b.date) || a.createdAt - b.createdAt);
      stage.replaceChildren(...[0, 1].map(k => {
        const e = chosen[k];
        return e
          ? el('figure', { class: 'compare-side' },
              el('img', { src: Util.imageUrl(e), alt: e.title || 'Drawing from ' + Util.formatDate(e.date) }),
              el('figcaption', {}, el('span', { class: 'date-label' }, Util.formatDate(e.date)), e.title && el('span', { class: 'piece-title' }, e.title)))
          : el('div', { class: 'compare-side empty-side' }, 'Pick another drawing below');
      }));
      hint.textContent = picks.length < 2 ? 'Pick one more drawing.' : 'Tap any drawing below to swap.';
      strip.querySelectorAll('.strip-item').forEach(b => b.classList.toggle('picked', picks.includes(b.dataset.id)));
    }

    entries.forEach(e => strip.append(el('button', {
      class: 'strip-item', type: 'button', 'data-id': e.id,
      'aria-label': 'Drawing from ' + Util.formatDate(e.date),
      onclick: () => {
        if (picks.includes(e.id)) picks = picks.filter(id => id !== e.id);
        else picks = [...picks, e.id].slice(-2);
        draw();
      },
    },
      el('img', { src: Util.imageUrl(e), alt: '' }),
      el('span', {}, Util.formatDate(e.date, { month: 'short', day: 'numeric' })))));

    root.replaceChildren(el('section', { class: 'page wide' },
      el('h1', {}, 'Look Closer'), stage, prompt, hint, strip));
    draw();
  },
};
