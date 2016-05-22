'use strict';

const elSlides = document.querySelector('.slides');
let model = window.model = parse({
  slideIndex: 0,
  slides: [],
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

  return model;
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
  window.history.pushState({}, '', window.location.pathname.replace(/\/\d+$/, `/${slideIndex}`));
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
 * Advance to next step/slide
 */
function next () {
  if (model.stepTotal && model.stepIndex + 1 <= model.stepTotal) {
    changeStep(model.stepIndex + 1);
  } else if (model.slideIndex + 1 < model.slides.length) {
    changeSlide(model.slideIndex + 1);
  }
}

/**
 * Advance to previous step/slide
 */
function prev () {
  if (model.stepTotal && model.stepIndex - 1 >= 0) {
    changeStep(model.stepIndex - 1);
  } else if (model.slideIndex - 1 >= 0) {
    changeSlide(model.slideIndex - 1);
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

document.addEventListener('keyup', onKeyDown, false);
window.addEventListener('popstate', onPopState, false);
window.history.replaceState({}, document.title, window.location.pathname);
hljs.initHighlightingOnLoad();

changeSlide(getUrlSlide());