// "View My Journey": every drawing hung along a winding string, earliest -> newest,
// scrolled sideways like walking along a studio wall.
window.JourneyView = {
  PIECE_W: 250,
  GAP: 330,
  PAD: 160,

  async render(root, params = []) {
    const practiceId = Config.currentPracticeId();
    const entries = await ArtStore.list(practiceId);
    const rerender = () => JourneyView.render(root);

    const header = el('div', { class: 'journey-head' },
      el('h1', {}, 'My Journey'),
      PRACTICES.length > 1 && el('select', {
        'aria-label': 'Drawing practice',
        onchange: e => { Config.setCurrentPracticeId(e.target.value); rerender(); },
      }, PRACTICES.map(p => el('option', { value: p.id, selected: p.id === practiceId }, p.name))),
    );

    if (!entries.length) {
      root.replaceChildren(el('section', { class: 'journey-page' }, header,
        el('div', { class: 'empty' },
          el('p', {}, 'Your journey is waiting for its first drawing.'),
          el('a', { class: 'btn primary', href: '#add' }, 'Add My Art'))));
      return;
    }

    const { PIECE_W, GAP, PAD } = JourneyView;
    const width = PAD * 2 + (entries.length - 1) * GAP + PIECE_W;
    const height = 560;
    const pinY = i => 150 + Math.sin(i * 1.15) * 55;     // gentle wave
    const pinX = i => PAD + i * GAP + PIECE_W / 2;

    // The string the drawings hang from.
    let d = `M0,${pinY(0) - 10}`;
    const pts = entries.map((_, i) => [pinX(i), pinY(i)]);
    pts.forEach(([x, y], i) => {
      const px = i ? pts[i - 1][0] : 0, py = i ? pts[i - 1][1] : pinY(0) - 10;
      const mx = (px + x) / 2;
      d += ` C${mx},${py + 18} ${mx},${y + 18} ${x},${y}`;
    });
    d += ` L${width},${pts[pts.length - 1][1] - 6}`;
    const string = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    string.setAttribute('class', 'journey-string');
    string.setAttribute('width', width);
    string.setAttribute('height', height);
    string.innerHTML = `<path d="${d}" fill="none" stroke="#a98d6a" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round"/>`;

    let lastMonth = '';
    const pieces = entries.map((entry, i) => {
      const rot = [-2.2, 1.6, -1, 2.4, -1.8, 1][i % 6];
      const month = Util.monthKey(entry.date);
      const label = month !== lastMonth
        ? el('span', { class: 'month-mark' }, Util.formatDate(entry.date, { month: 'long', year: 'numeric' })) : null;
      lastMonth = month;
      return el('button', {
        class: 'piece', type: 'button', 'data-id': entry.id,
        style: `left:${pinX(i) - PIECE_W / 2}px; top:${pinY(i)}px; width:${PIECE_W}px; --rot:${rot}deg`,
        'aria-label': `Artwork from ${Util.formatDate(entry.date)}${entry.title ? ': ' + entry.title : ''}`,
        onclick: () => ArtModal.open(entry, {
          onChange: rerender,
          onCompare: e => { location.hash = '#closer/' + e.id; },
        }),
      },
        label,
        el('span', { class: 'tape' }),
        el('img', { src: Util.imageUrl(entry), alt: entry.title || '', loading: 'lazy' }),
        el('span', { class: 'piece-date' }, Util.formatDate(entry.date, { month: 'short', day: 'numeric', year: 'numeric' })),
        entry.title && el('span', { class: 'piece-title' }, entry.title),
      );
    });

    const track = el('div', { class: 'journey-track', style: `width:${width}px; height:${height}px` }, string, pieces);
    const scroller = el('div', { class: 'journey-scroll', tabindex: 0, 'aria-label': 'Your drawings from earliest to newest' }, track);

    // Mouse wheel scrolls sideways.
    scroller.addEventListener('wheel', e => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { scroller.scrollLeft += e.deltaY; e.preventDefault(); }
    }, { passive: false });

    const by = dir => scroller.scrollBy({ left: dir * GAP * 2, behavior: 'smooth' });
    const toEnd = end => scroller.scrollTo({ left: end ? width : 0, behavior: 'smooth' });

    let prompt = Util.randomPrompt();
    const promptEl = el('p', { class: 'gentle-prompt center' }, prompt);

    root.replaceChildren(el('section', { class: 'journey-page' },
      header,
      el('div', { class: 'journey-controls' },
        el('button', { class: 'btn soft', onclick: () => toEnd(false) }, '⟸ First drawing'),
        el('button', { class: 'btn', onclick: () => by(-1), 'aria-label': 'Earlier' }, '← Earlier'),
        el('button', { class: 'btn', onclick: () => by(1), 'aria-label': 'Later' }, 'Later →'),
        el('button', { class: 'btn soft', onclick: () => toEnd(true) }, 'Newest ⟹'),
      ),
      scroller,
      promptEl,
      el('p', { class: 'center' },
        el('button', { class: 'btn quiet', onclick: () => { prompt = Util.randomPrompt(prompt); promptEl.textContent = prompt; } }, 'Another question')),
    ));

    // Newly added drawing? Walk to it. Otherwise start at the beginning.
    const focusId = params[0];
    const idx = focusId ? entries.findIndex(e => e.id === focusId) : -1;
    scroller.scrollLeft = 0;
    if (idx >= 0) {
      const target = pinX(idx) - scroller.clientWidth / 2;
      scroller.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
      pieces[idx].classList.add('just-added');
    }
  },
};
