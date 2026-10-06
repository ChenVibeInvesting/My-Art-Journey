// Practices are the long-term art exercises a journey can follow.
// Nothing else in the app depends on "fish": add an entry here to start a new journey.
window.PRACTICES = [
  { id: 'fish', name: 'Fish drawing' },
  // { id: 'flowers', name: 'Flowers' },
  // { id: 'portraits', name: 'Portraits' },
  // { id: 'buildings', name: 'Buildings' },
];

// Gentle questions that invite noticing — never judging.
window.PROMPTS = [
  'What do you notice?',
  'What has changed?',
  'What details did you begin to notice?',
  'How have your shapes or lines changed?',
  'What would you like to try next?',
];

window.Config = {
  currentPracticeId() {
    try { return localStorage.getItem('maj.practice') || PRACTICES[0].id; } catch { return PRACTICES[0].id; }
  },
  setCurrentPracticeId(id) {
    try { localStorage.setItem('maj.practice', id); } catch { /* ignore */ }
  },
};
