/**
 * var MyBankSearch - Methods for c-MyBankSearch component
 * @module js/components
 * @requires js/vendor/jquery
 * @requires js/vendor/underscore
 * @requires js/vendor/iscroll
 * @requires js/vendor/jquery.mask
 *
 */
var MyBankSearch = (function(){
  'use strict';

  // Global variable for this component
  var DOM = {};
  var GLOBAL = {};

  /** Catch DOM elements */
  var catchDOM = function () {
    DOM.main_content = $('.MainContent__content');
    DOM.footer = $('.l-Footer__content');

    DOM.search_form = $('.c-MyBankSearch__form');
    DOM.search_form_container = $('.c-MyBankSearch__formContainer');
    DOM.search_form_submit_button = $('.c-MyBankSearch__submitButton');
    DOM.search_input = $(".c-MyBankSearch__searchInput");
    DOM.alternative_message = $(".c-MyBankSearch__alternativeMessage");
    DOM.result_container = $(".c-MyBankSearch__resultContainer");
    DOM.result_list = $(".c-MyBankSearch__resultList");
  };

  /**
   * Component initializer
   * @param {string} file_path - JSON file path
   */
  var init = function(file_path) {

    catchDOM();
    events.contentDisabled();
    events.overlayEvents();
    events.searchFormValidate();

    if(file_path === undefined){ return false; }

    /**
     * @param {string} file_path - Path of JSON data file
     * @param {object} - Callback function to recive data loaded
     */
    events.loadData(file_path, function(data){
      if (data !== 'error') {
        GLOBAL.banks_data = data;
        events.enableSearch(data);
      }
    });
  };


  var events = {};

  /** Overlay to disabled elements events */
  events.overlayEvents = function() {
    $('.h-overlay-disabled').on('click', function(){
      events.searchFormError();
    });
  };

  /** Enable ticket and footer elements */
  events.contentEnabled = function(){
    DOM.main_content.find('.h-overlay-disabled').remove();
    DOM.footer.find('.h-overlay-disabled').remove();
  }

  /** Disabled ticket and footer */
  events.contentDisabled = function(){
    var disabled_overlay = DOM.main_content.find('.h-overlay-disabled') || DOM.footer.find('.h-overlay-disabled');

    // Verify to disable content and footer
    if (disabled_overlay.length === 0) {

      DOM.main_content.append('<div class="h-overlay-disabled"></div>');
      DOM.footer.append('<div class="h-overlay-disabled"></div>');
    }
  }

  /** Validate search form */
  events.searchFormValidate = function(){

    // Accept only alpha character
    DOM.search_input.mask('X', {'translation': {
      X: {pattern: /[A-Za-z]/, recursive: true}
    }});

    DOM.search_form.on('submit', function(event) {
      event.preventDefault();

      if (DOM.search_input.val() === "") {
        events.searchFormError();

      } else {
        events.searchFormValid();
      }
      return false;
    });
  };

  /** Add error styles for seach form */
  events.searchFormError = function() {
    DOM.search_form_container.addClass('error');
    DOM.search_form_submit_button.addClass('error');
    DOM.search_input.addClass('error');
  }

  /** Remove error styles for seach form */
  events.searchFormValid = function() {
    DOM.search_form_container.removeClass('error');
    DOM.search_form_submit_button.removeClass('error');
    DOM.search_input.removeClass('error');
  }

   /**
   * events.loadData - Load data of JSON file
   *
   * @param  {string} file_path - JSON file path to load
   * @param  {object} fn - Callback function
   * @return {json} - List of banks
   */
  events.loadData = function(file_path, fn){

    $.ajax({
      dataType: "json",
      url: file_path,
    }).done(function(data){
      fn(data);

    }).error(function(err){
      fn('error')

    });
  };

  /** Enable input text to search banks */
  events.enableSearch = function(){

    var search_value;
    DOM.search_input.on('keyup', function(event){
      var self = $(this);
      search_value = self.val().toUpperCase();


      if (search_value !== "") {
        if (event.keyCode === 38 || event.keyCode === 40) {
          return false;
        }

        events.searchFormValid(); //Remove error styles
        events.contentEnabled(); //Enable ticket and footer
        events.runSearch(search_value); //Call search method
      }

      if (search_value === "") {
        events.resetSearch(); //Reset result list, scroll and hide result
      }
    });
  }

   /**
   * events.runSearch - Search word in JSON data banks
   * @param  {string} word - Input text word
   */
  events.runSearch = function(word){
    events.resetSearch(); //Reset result list, scroll and hide result

    // Search word using underscore method
    var search_result = _.filter(GLOBAL.banks_data, function (bank) {
      return bank.alias.search(word) !== -1;
    });

    if (search_result.length > 0) {
      setTimeout(function () { DOM.alternative_message.removeClass('is-visible'); }, 500);
      events.showResults(search_result);

    } else {
      setTimeout(function(){ DOM.alternative_message.addClass('is-visible'); }, 500);
    }
  };

  /** Clean events and search result elements */
  events.resetSearch = function() {
    DOM.result_container.removeClass("is-visible");
    DOM.result_list.html('');
    (GLOBAL.scroll_result) ? GLOBAL.scroll_result.destroy() : '';
  };

  /** Show results interface */
  events.showResults = function(search_result){

    // Underscore method to navigate the result array
    _.each(search_result, function (bank, index) {

      // Show result container
      DOM.result_container.addClass("is-visible");

      // Add 'li' element to the list
      jQuery("<li/>", {
        class: "c-MyBankSearch__resultItem",
        text: bank.alias,
        "data-participant": bank.participant,
        click: function () {

          var self = $(this),
            bank_name = self.text(),
            bank_participant = self.attr("data-participant");

          events.saveSelectedResult(bank_name, bank_participant);
        }
      }).appendTo(DOM.result_list);

      // Verify if is the last item
      if ( index === (search_result.length-1) ) {

        // Create dynamic scroll using iScroll plugin
        GLOBAL.scroll_result = new IScroll('.c-MyBankSearch__resultContainer', {
          mouseWheel: true,
          scrollbars: true,
          interactiveScrollbars: true,
          click: true,
          resizeScrollbars: false,
          keyBindings: true
        });
      }
    });

  };

  /** Navigate results */
  events.navigateResultsByArrows = function() {

  };

  /** Save search item selected */
  events.saveSelectedResult = function(bank_name, bank_participant){

    //Reset result list, scroll and hide result
    events.resetSearch();

    // Save selected value
    DOM.search_input.val(bank_name);

  }

  /** Public methods */
  return {
    init: function(file_path){
      init(file_path);
    }
  }

})();
