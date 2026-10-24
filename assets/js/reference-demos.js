document.querySelectorAll('[data-active-demo]').forEach(demo => {
  const buttons = demo.querySelectorAll('[data-note]');
  function show(id) {
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.note === id)));
    demo.querySelectorAll('[data-note-text]').forEach(note => { note.hidden = note.dataset.noteText !== id; });
  }
  buttons.forEach(button => {
    button.addEventListener('click', () => show(button.dataset.note));
    button.addEventListener('mouseenter', () => show(button.dataset.note));
    button.addEventListener('focus', () => show(button.dataset.note));
  });
});
