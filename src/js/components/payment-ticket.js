/**
 * var PaymentTicket - Methods for c-PaymentTicket component
 * @module js/components
 * @requires js/vendor/jquery
 *
 */
var PaymentTicket = (function(){
  'use strict';
  
  var init = function() {

    // Terms and conditions checkbox
    $('.c-PaymentTicket__footer__terms input').on('click', function(){
      var self = $(this);
      if (!self.is(':checked')) {
        events.buttonsDisabled();
      } else {
        events.buttonsEnabled();
      }
    });
  };

  var events = {};

  /** Disabled buttons */
  events.buttonsDisabled = function() {
    $('button.c-CallToActionButton').attr('disabled','disabled').addClass('is-disabled');
  };


  /** Enable buttons */
  events.buttonsEnabled = function() {
    $('button.c-CallToActionButton').removeAttr('disabled').removeClass('is-disabled');
  };

  return {
    init:init
  };
})();
