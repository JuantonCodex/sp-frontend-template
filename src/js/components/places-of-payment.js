/**
 * var PlacesOfPayment - Methdos for c-PlacesOfPayment component
 * @module js/components
 * @requires js/vendor/jquery
 * @requires js/vendor/slick
 *
 */
var PlacesOfPayment = (function(){
  'use strict';
  var DOM = {};

  var init = function(){

    // Online payment
    events.createSlider('.c-PlacesOfPayment--onlinePayment');

    // Cash payment
    events.createSlider('.c-PlacesOfPayment--cashPayment');

    events.selectEntity();
  };

  // Object where we will save the main methods
  var events = {};

  /**
   * Create slide using slick plugin
   * @param {string} slider_container_class - div class
   */
  events.createSlider = function(slider_container_class){

    var slider_container    = $(slider_container_class).find('.c-PlacesOfPayment-listWrapper');
    var slider         = $(slider_container_class).find('.c-PlacesOfPayment-list');
    var nav_buttons_container = $(slider_container_class).find('.c-PlacesOfPayment-listButtons');

    // Initialize slider/
    slider.slick({
      infinite: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      appendArrows: nav_buttons_container,
      prevArrow: '<div class="slideButton slideButton--prev"><i class="icon"></i></div>',
      nextArrow: '<div class="slideButton slideButton--next"><i class="icon"></i></div>',
      speed: 250,
      cssEase: 'linear',
      focusOnSelect: false,
      reponsive: false
    });

    /** After change slider event */
    slider.on('afterChange', function(event, slick, direction){
      var btn_prev = slick.$prevArrow;
      var btn_next = slick.$nextArrow;

      if (btn_prev.hasClass('slick-disabled')) {

        slider_container.removeClass('padding_left');
      }else {
        slider_container.addClass('padding_left');
      }

      if (btn_next.hasClass('slick-disabled')) {
        slider_container.addClass('no_padding_right');
      }else {
        slider_container.removeClass('no_padding_right');
      }

    });
  };

  /** To fix sliders position */
  events.refreshAllSliders = function(){
    $('.c-PlacesOfPayment-list').slick('setPosition');
  };

  /** On click slider element */
  events.selectEntity = function() {
    var entidad_button = $('.c-PlacesOfPayment-list a.link');
    entidad_button.on('click', function(event){
      event.preventDefault();
      var self = $(this);

      // Change element selected style
      self.parents('.c-PlacesOfPayment-list').find('a.link').removeClass("is-selected");
      self.addClass("is-selected");

    });

  };

  /** return public methods */
  return {
    init: init,
    refreshAllSliders: events.refreshAllSliders
  };
})();
