// -temporal coupling-
// notice that starting horizontally, going vertical, going horizontal leads to
// a difference from the original rendering the 170 gets passed back to
// originally shorter content divs ideally, horizontally() and vertically()
// would not be temporally coupled (the order in which they are called should
// not matter)

// -single responsibility-
// on another note, perhaps the correct thing to do for performance/
// maintainability is to apply all of the styling in the js under horizontally
// and vertically completely avoiding use of @media. At least that way, all of
// the responsive stuff lives in one place.

// -performance-
// measured very informally using the firefox profiler on linux while quickly
// resizing the browser: tests that don't result in restyling take about 1 ms.
// in other words, even if the browser raised resize events a thousand times
// over the course of one second, we could keep up. Maybe not flipping back
// and forth over the boundary, but that's to be expected of the pathological
// case.

var onResize = (function (window, $, undefined){
  'use strict';

  var HORIZONTAL_LOWER_BOUND = 768; // inclusive
  var VERTICAL_LOGO_HEIGHT = 170;

  return onKeyChange(isHorizontal, resize, undefined);

  function onKeyChange(key, fn, last) {
    return function () {
      var current = key();
      if (current !== last) {
        fn(current);
        last = current;
      }
    };
  }

  // test desired content orientation
  function isHorizontal() {
    return $(window).width() >= HORIZONTAL_LOWER_BOUND;
  }

  // apply content orientation
  function resize(horizontal) {
    console.log('orienting ' + (horizontal ? 'horizontally' : 'vertically'));
    $('.row').each(horizontal ? horizontally : vertically);
  }

  // apply styling for logo and content side by side.
  function horizontally() {
    var col1 = $('.col1', this);
    var col2 = $('.col2', this);
    var height = Math.max(col1.height(), col2.height());
    col1.height(height);
    col2.height(height);
  }

  // apply styling for logo above content.
  function vertically() {
    var col1 = $('.col1', this);
    col1.height(VERTICAL_LOGO_HEIGHT);
  }

}(this, jQuery));

$(function () {

  // ... create the content elements ...

  onResize();
  $(window).on('resize', onResize);
});
