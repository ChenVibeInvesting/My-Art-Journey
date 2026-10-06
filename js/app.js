// Tiny hash router: #home, #add, #journey[/<id>], #closer[/<id>]
(function () {
  const routes = { home: HomeView, add: AddView, journey: JourneyView, closer: CloserView };
  const root = document.getElementById('app');

  async function route() {
    const [name, ...params] = (location.hash.slice(1) || 'home').split('/');
    const view = routes[name] || HomeView;
    document.getElementById('artDialog').open && document.getElementById('artDialog').close();
    document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('current', a.dataset.nav === name));
    document.body.dataset.page = routes[name] ? name : 'home';
    try {
      await view.render(root, params);
    } catch (err) {
      console.error(err);
      root.replaceChildren(el('section', { class: 'page' },
        el('p', {}, 'Oops, something went wrong opening this page.'),
        el('a', { class: 'btn', href: '#home' }, 'Back home')));
    }
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', route);
  Placeholders.seedIfFirstRun().catch(console.error).finally(route);
})();
