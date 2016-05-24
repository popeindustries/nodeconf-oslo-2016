'use strict';

const TARGET_HEIGHT = 1080;
const TARGET_WIDTH = 1920;
const TOUCH_THRESHOLD = 100;

const elSlides = document.querySelector('.slides');
const isProduction = process.env.NODE_ENV == 'production';
const isNotes = window.name == 'notes';
const startingSlide = isProduction ? 0 : getUrlSlide();
let model = window.model = parse({
  notes: [],
  noteIndex: 0,
  notesWindow: null,
  slides: [],
  slideIndex: 0,
  steps: [],
  stepIndex: 0
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
  model.notes = model.slides.reduce((notes, element, idx) => {
    notes.push(Array.prototype.slice.call(element.querySelectorAll('.note')));
    return notes;
  }, []);
  model.steps = model.slides.reduce((steps, element, idx) => {
    steps.push(Array.prototype.slice.call(element.querySelectorAll('.step')).length);
    return steps;
  }, []);

  return model;
}

/**
 * Display slide at 'slideIndex'
 * @param {Number} slideIndex
 * @param {Boolean} back
 */
function changeSlide (slideIndex, back) {
  const current = model.slides[model.slideIndex];
  const next = model.slides[slideIndex];
  const noteIndex = back ? model.notes[slideIndex].length - 1 : 0;

  model.stepIndex = back ? model.steps[slideIndex] + 1 : 0;

  next.classList.add('show');
  next.classList.remove('hide');
  next.style.zIndex = 100 - slideIndex;
  if (current && next != current) {
    current.classList.add('hide');
    current.addEventListener('transitionend', onTransitionEnd, false);
  }
  changeNote(model.slideIndex, slideIndex, noteIndex, back);
  model.slideIndex = slideIndex;
  window.history.pushState({}, '', window.location.pathname.replace(/\/\d*$/, `/${slideIndex}`));
}

/**
 * Display note at 'noteIndex'
 * @param {Number} currentSlideIndex
 * @param {Number} nextSlideIndex
 * @param {Number} noteIndex
 * @param {Boolean} back
 */
function changeNote (currentSlideIndex, nextSlideIndex, noteIndex, back) {
  const current = model.notes[currentSlideIndex][model.noteIndex];
  const next = model.notes[nextSlideIndex][noteIndex];
  const isStep = /step/.test(next.getAttribute('class'));
  const wasStep = back && /step/.test(current.getAttribute('class'));

  if (current) current.style.opacity = 0;
  if (next) next.style.opacity = 1;
  if (isStep || wasStep) changeStep(nextSlideIndex, back ? model.stepIndex - 1 : model.stepIndex + 1);
  if (model.notesWindow) model.notesWindow.change(currentSlideIndex, nextSlideIndex, model.noteIndex, noteIndex);
  model.noteIndex = noteIndex;
}

/**
 * Display step at 'stepIndex'
 * @param {Number} slideIndex
 * @param {Nunber} stepIndex
 */
function changeStep (slideIndex, stepIndex) {
  const slide = model.slides[slideIndex];
  let classStr = slide.getAttribute('class').replace(/\s?step-\d\s?/g, '');

  for (let i = 1; i <= stepIndex; i++) {
    classStr += ` step-${i}`;
  }
  slide.setAttribute('class', classStr);
  model.stepIndex = stepIndex;
}

function changeRemoteNote (currentSlideIndex, nextSlideIndex, currentNoteIndex, nextNoteIndex) {
  const currentSlide = model.slides[currentSlideIndex];
  const nextSlide = model.slides[nextSlideIndex];
  const currentNote = model.notes[currentSlideIndex][currentNoteIndex];
  const nextNote = model.notes[nextSlideIndex][nextNoteIndex];

  nextSlide.classList.add('show');
  nextSlide.classList.remove('hide');
  nextSlide.style.zIndex = 100 - nextSlideIndex;
  if (currentSlide && nextSlide != currentSlide) {
    currentSlide.classList.add('hide');
    currentSlide.classList.remove('show');
  }
  if (currentNote) currentNote.style.opacity = 0;
  if (nextNote) nextNote.style.opacity = 1;
}

/**
 * Advance to next step/slide/note
 */
function next () {
  if (model.noteIndex + 1 < model.notes[model.slideIndex].length) {
    changeNote(model.slideIndex, model.slideIndex, model.noteIndex + 1);
  } else if (model.slideIndex + 1 < model.slides.length) {
    changeSlide(model.slideIndex + 1);
  } else {
    return;
  }
}

/**
 * Advance to previous step/slide/note
 */
function prev () {
  if (model.noteIndex - 1 >= 0) {
    changeNote(model.slideIndex, model.slideIndex, model.noteIndex - 1, true);
  } else if (model.slideIndex - 1 >= 0) {
    changeSlide(model.slideIndex - 1, true);
  } else {
    return;
  }
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
}

/**
 * Handle touch
 * @param {Event} evt
 */
function onTouchStart (evt) {
  evt.preventDefault();
  const start = evt.layerX;
  let cb;

  document.documentElement.addEventListener('touchend', (cb = function (evt) {
    document.documentElement.removeEventListener('touchend', cb, false);
    const diff = start - evt.layerX;

    if (Math.abs(diff) >= TOUCH_THRESHOLD) (diff > 0) ? next() : prev();
  }), false);
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
  document.addEventListener('keyup', onKeyDown, false, { passive: true });
  document.documentElement.addEventListener('touchstart', onTouchStart, false);
  window.addEventListener('popstate', onPopState, false);
  window.history.replaceState({}, document.title, window.location.pathname);

  if (elSlides.clientWidth / elSlides.clientHeight != TARGET_WIDTH / TARGET_HEIGHT) {
    console.log('fix', elSlides.clientWidth, elSlides.clientHeight);
    elSlides.style.width = `${TARGET_WIDTH}px`;
    elSlides.style.height = `${TARGET_HEIGHT}px`;
    elSlides.style.transform = `scale(${document.documentElement.clientWidth / TARGET_WIDTH})`;
  }

  hljs.initHighlightingOnLoad();

  if (!isProduction) {
    document.documentElement.classList.add('dev');
    changeSlide(startingSlide);
  } else {
    model.notesWindow = window.open(window.location.href, 'notes');
    setTimeout(() => {
      changeSlide(startingSlide);
    }, 1000);
  }
} else {
  window.change = changeRemoteNote;
  document.documentElement.classList.add('presentation-notes');
}