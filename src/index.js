'use strict';

const elSlides = document.querySelector('.slides');
const isProduction = process.env.NODE_ENV == 'production';
const isNotes = window.name == 'notes';
const startingSlide = isProduction ? 0 : getUrlSlide();
let startingNote = 0;
let model = window.model = parse({
  notes: [],
  noteIndex: 0,
  notesWindow: null,
  slides: [],
  slideIndex: 0,
  stepIndex: 0,
  stepTotal: 0
});

/**
 * Parse slide elements
 * @param {Object} model
 * @returns {Array}
 */
function parse (model) {
  model.slides = Array.prototype.slice.call(elSlides.children).filter((element) => {
    return element.tagName == 'HEADER' || element.tagName == 'SECTION';
  });
  if (isNotes) {
    model.notes = model.slides.reduce((notes, element, idx) => {
      if (startingSlide == idx) startingNote = notes.length;
      return notes.concat(Array.prototype.slice.call(element.querySelectorAll('.note')));
    }, []);
  }

  return model;
}

/**
 * Open notes window
 */
function openNotes () {
  if (!isProduction) model.notesWindow = window.open(window.location.href, 'notes');
}

/**
 * Display slide at 'slideIndex'
 * @param {Nunber} slideIndex
 */
function changeSlide (slideIndex) {
  const back = slideIndex < model.slideIndex;
  const current = model.slides[model.slideIndex];
  const next = model.slides[slideIndex];

  model.stepTotal = parseInt(next.dataset.steps, 10) || 0;
  model.stepIndex = back ? model.stepTotal : 0;

  next.classList.add('show');
  next.classList.remove('hide');
  next.style.zIndex = 100 - slideIndex;
  if (current && next != current) {
    current.classList.add('hide');
    current.addEventListener('transitionend', onTransitionEnd, false);
  }
  model.slideIndex = slideIndex;
  changeStep(model.stepIndex);
  window.history.pushState({}, '', window.location.pathname.replace(/\/\d*$/, `/${slideIndex}`));
}

/**
 * Display step at 'stepIndex'
 * @param {Nunber} stepIndex
 */
function changeStep (stepIndex) {
  const slide = model.slides[model.slideIndex];
  let classStr = slide.getAttribute('class').replace(/\s?step-\d\s?/g, '');

  for (let i = 1; i <= stepIndex; i++) {
    classStr += ` step-${i}`;
  }
  slide.setAttribute('class', classStr);
  model.stepIndex = stepIndex;
}

/**
 * Display note at 'noteIndex'
 * @param {Number} noteIndex
 */
function changeNote (noteIndex) {
  const current = model.notes[model.noteIndex];
  const next = model.notes[noteIndex];

  if (current) current.style.opacity = 0;
  if (next) next.style.opacity = 1;
  model.noteIndex = noteIndex;
}

/**
 * Advance to next step/slide/note
 * @returns {null}
 */
function next () {
  if (isNotes) return changeNote(model.noteIndex + 1);
  if (model.stepTotal && model.stepIndex + 1 <= model.stepTotal) {
    changeStep(model.stepIndex + 1);
  } else if (model.slideIndex + 1 < model.slides.length) {
    changeSlide(model.slideIndex + 1);
  } else {
    return;
  }
  if (model.notesWindow) model.notesWindow.next();
}

/**
 * Advance to previous step/slide/note
 * @returns {null}
 */
function prev () {
  if (isNotes) return changeNote(model.noteIndex - 1);
  if (model.stepTotal && model.stepIndex - 1 >= 0) {
    changeStep(model.stepIndex - 1);
  } else if (model.slideIndex - 1 >= 0) {
    changeSlide(model.slideIndex - 1);
  } else {
    return;
  }
  if (model.notesWindow) model.notesWindow.prev();
}

/**
 * Get current slide index from url
 * @returns {Number}
 */
function getUrlSlide () {
  const slide = window.location.pathname
    .split('/')
    .slice(-1)[0];

  return parseInt(slide, 0) || 0;
}

/**
 * Handle key down
 * @param {Event} evt
 */
function onKeyDown (evt) {
  const key = (evt.key || evt.keyIdentifier).toLowerCase();

  if (key === 'arrowright'
    || key === 'arrowup'
    || key === 'right'
    || key === 'up'
    || key === 'pagedown') {
      next();
  }
  if (key === 'arrowleft'
    || key === 'arrowdown'
    || key === 'left'
    || key === 'down'
    || key === 'pageup')  {
      prev();
  }
  if (key === 'n') openNotes();
}

/**
 * Handle pop state event
 * @param {Event} evt
 */
function onPopState (evt) {
  if (evt.state) changeSlide(getUrlSlide());
}

/**
 * Handle transition end event
 * @param {Event} evt
 */
function onTransitionEnd (evt) {
  const slide = evt.target;

  slide.removeEventListener('transitionend', onTransitionEnd, false);

  if (slide.classList.contains('hide') && slide.classList.contains('show')) {
    slide.classList.remove('show');
    slide.style.zIndex = null;
  }
}

if (!isNotes) {
  document.addEventListener('keyup', onKeyDown, false);
  window.addEventListener('popstate', onPopState, false);
  window.history.replaceState({}, document.title, window.location.pathname);
  hljs.initHighlightingOnLoad();

  changeSlide(startingSlide);
} else {
  window.next = next;
  window.prev = prev;
  document.documentElement.classList.add('presentation-notes');

  changeNote(startingNote);
}