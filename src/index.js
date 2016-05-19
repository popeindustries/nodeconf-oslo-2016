'use strict';

const elSlides = document.querySelector('.slides');
let model = {
  slideIndex: 0,
  slides: parseSlides(Array.prototype.slice.call(elSlides.children)),
  stepIndex: 0,
  stepTotal: 0,
  total: 0
};
model.total = model.slides.length;

/**
 * Parse slide elements
 * @param {Array} elements
 * @returns {Array}
 */
function parseSlides (elements) {
  return elements.filter((element) => {
    return element.tagName == 'HEADER' || element.tagName == 'SECTION';
  });
}

/**
 * Advance to next slide
 */
function nextSlide () {
  if (model.slide + 1 < model.total) changeSlide(model.slide + 1);
}

/**
 * Advance to previous slide
 */
function prevSlide () {
  if (model.slide - 1 >= 0) changeSlide(model.slide - 1);
}

/**
 * Display 'slideIndex'
 * @param {Nunber} slideIndex
 */
function changeSlide (slideIndex) {
  const back = slideIndex < model.slideIndex;
  const current = model.slides[model.slideIndex];
  const next = model.slides[slideIndex];

  model.stepTotal = parseInt(next.dataset.steps, 10) || 2;
  model.stepIndex = 1;

  if (next != current) {
    next.classList.remove('stacked');
    next.classList.add('visible');
    if (back) {
      current.classList.remove('visible');
    } else {
      current.classList.add('stacked');
    }
  }

  model.slideIndex = slideIndex;
  window.history.pushState({}, 'slide ' + slideIndex, '/' + slideIndex);
}

/**
 * Display next partial element
 */
function nextStep () {
  const slide = mdoel.slides[model.slideIndex];
  const stepIndex = model.stepIndex + 1;

  if (stepIndex > model.stepTotal) return nextSlide();
  slide.classList.remove(`step-${model.stepIndex}`);
  slide.classList.add(`step-${stepIndex}`);
  model.stepIndex = stepIndex;
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
      nextStep();
  }
  if (key === 'arrowleft'
    || key === 'arrowdown'
    || key === 'left'
    || key === 'down'
    || key === 'pageup')  {
      prevSlide();
  }
}

/**
 * Handle pop state event
 * @param {Event} evt
 */
function onPopState (evt) {
  changeSlide(getUrlSlide());
}

document.addEventListener('keyup', onKeyDown, false);
window.addEventListener('popstate', onPopState, false);
window.history.replaceState({}, document.title);

const currentSlide = getUrlSlide();

model.slides.forEach((element, idx) => {
  if (idx < currentSlide) element.classList.add('stacked');
});
changeSlide(currentSlide);