// Sintra Hotel - Initialize background images and overlays
(function($) {
  'use strict';

  $(document).ready(function() {
    // Background images
    $('[data-background]').each(function() {
      $(this).css('background-image', 'url(' + $(this).attr('data-background') + ')');
    });

    // Background overlays
    $('[data-overlay-dark]').each(function() {
      $(this).prepend('<div class="overlay-dark"></div>');
      var overlay = $(this).attr('data-overlay-dark');
      $(this).find('.overlay-dark').css('opacity', overlay / 10);
    });

    $('[data-overlay-light]').each(function() {
      $(this).prepend('<div class="overlay-light"></div>');
      var overlay = $(this).attr('data-overlay-light');
      $(this).find('.overlay-light').css('opacity', overlay / 10);
    });
  });

})(jQuery);
