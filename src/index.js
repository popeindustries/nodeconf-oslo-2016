'use strict';

const elHtml = document.documentElement;
const elSlides = document.querySelector('.slides');
let model = {
  slide: 0,
  slides: parseSlides(Array.prototype.slice.call(elSlides.children)),
  partials: [],
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
 * Display 'slide'
 * @param {Nunber} slide
 */
function changeSlide (slide) {
  const back = slide < model.slide;
  const current = model.slides[model.slide];
  const next = model.slides[slide];

  model.partials = Array.prototype.slice.call(next.querySelectorAll('.partial:not(.show)')) || [];

  if (next != current) {
    next.classList.remove('stacked');
    next.classList.add('visible');
    if (back) {
      current.classList.remove('visible');
    } else {
      current.classList.add('stacked');
    }
  }

  model.slide = slide;
  window.history.pushState({}, 'slide ' + slide, '/' + slide);
}

/**
 * Display next partial element
 */
function showPartial () {
  model.partials.shift().classList.add('show');
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
  if (evt.code === 'ArrowRight'
    || evt.code === 'ArrowUp'
    || evt.code === 'PageDown') {
      model.partials.length
        ? showPartial()
        : nextSlide();
  }
  if (evt.code === 'ArrowLeft'
    || evt.code === 'ArrowDown'
    || evt.code === 'PageUp')  {
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