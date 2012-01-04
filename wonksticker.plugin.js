// http://coding.smashingmagazine.com/2011/10/11/essential-jquery-plugin-patterns/
;(function ( $, window, document, undefined ) {

  // Create the defaults once
  var pluginName = 'wonksticker',
    defaults = {
      increment : -3,
      speed : 50,
      pixelBuffer : 20
    };

  // The actual plugin constructor
  function Plugin( element, options ) {
    this.element = element;

    // jQuery has an extend method that merges the
    // contents of two or more objects, storing the
    // result in the first object. The first object
    // is generally empty because we don't want to alter
    // the default options for future instances of the plugin
    this.options = $.extend( {}, defaults, options) ;

    this._defaults = defaults;
    this._name = pluginName;

    this.increment = this.options.increment;
    this.speed = this.options.speed;
    this.pixelBuffer = this.options.pixelBuffer;

    this.currLeft = 0;
    this.tickerInterval = 0;
    this.firstItemWidth = 0;

    this.maskBufferWidth = 60;

    this.init();
  }

  Plugin.prototype.init = function () {
    // Place initialization logic here
    // You already have access to the DOM element and
    // the options via the instance, e.g. this.element
    // and this.options
console.log('fsafs');
/*
    // calculate the width that the mask should be
    var ticker_title = $('#ticker-title');
    var ticker_end = $('#ticker-end');

    var mask_width = $(document).width() - (this.maskBufferWidth + ticker_title.width() + ticker_end.width());
    $('.mask').css('width', mask_width + 'px');


    // calculate the width of the ticker elements
    var total_ticker_el_width = 0;
    $('.mask li').each(function(i){
      total_ticker_el_width += $(this).outerWidth();
    });
    total_ticker_el_width += this.pixelBuffer // add on buffer so IE behaves
    $('.mask ul').css('width', total_ticker_el_width + 'px');


    // hover behaviours and start scrolling
    var thisObj = this;
    $(this.element).hover(function () {
      thisObj.stopScrolling()
    }, function () {
      thisObj.startScrolling()
    });

    this.startScrolling();
*/
  };

  // ported from cmc.core.js
  Plugin.prototype.scroll = function() {
    this.currLeft += this.increment;

    if (this.currLeft < (this.firstItemWidth * -1) - this.pixelBuffer) {
      var jFirst = $(this.element).children("li").eq(0).remove();
      $(this.element).append(jFirst);
      this.currLeft += this.firstItemWidth;
      this.firstItemWidth = parseInt($(this.element).children("li").eq(0).outerWidth())
    }
    $(this.element).css("left", this.currLeft + "px");
  };

  //
  Plugin.prototype.startScrolling = function() {
    this.scroll();
    var thisObj = this;

    this.tickerInterval = window.setInterval(function () {
      thisObj.scroll()
    }, this.speed)
  };

  //
  Plugin.prototype.stopScrolling = function() {
    window.clearInterval(this.tickerInterval);
  };


  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function ( options ) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName,
        new Plugin( this, options ));
      }
    });
  }

})( jQuery, window, document );
