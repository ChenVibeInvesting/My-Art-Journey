window.HomeView = {
  async render(root) {
    root.replaceChildren(
      el('section', { class: 'home' },
        el('h1', {}, 'My Art Journey'),
        el('p', { class: 'subtitle' }, 'Every drawing is part of the journey.'),
        el('div', { class: 'home-actions' },
          el('a', { class: 'btn primary big', href: '#journey' }, 'View My Journey'),
          el('div', { class: 'home-secondary' },
            el('a', { class: 'btn', href: '#add' }, 'Add My Art'),
            el('a', { class: 'btn', href: '#closer' }, 'Look Closer'),
          ),
        ),
      ),
    );
  },
};
