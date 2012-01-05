// http://coding.smashingmagazine.com/2011/10/11/essential-jquery-plugin-patterns/
;(function ( $, window, document, undefined ) {

  // Create the defaults once
  var pluginName = 'wonksticker',
    defaults = {
      increment : -3,
      speed : 50,
      pixelBuffer : 30,
      tickerWidth: 0,
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
    this.tickerWidth = this.options.tickerWidth;

    this.currLeft = 0;
    this.tickerInterval = 0;
    this.firstItemWidth = 0;

    this.init();
  }

  Plugin.prototype.init = function () {

    var ticker = $(this.element);

    // set up ticker html and css
    ticker.wrap('<div class="ticker-mask" />');
    ticker.css('position', 'absolute');
    ticker.css('margin', '0');
    ticker.css('padding', '0');

		// set up ticker mask css
    var mask = ticker.parent();
    mask.css('position', 'relative');
    mask.css('overflow', 'hidden');

    // calculate and set how wide the ticker should be
    var total_ticker_el_width = 0;
    $('li', ticker).each(function(i){
      total_ticker_el_width += $(this).outerWidth()+ parseInt($(this).css('marginLeft')) + parseInt($(this).css('marginRight'));
    });
    total_ticker_el_width += this.pixelBuffer // add on buffer so IE behaves
    ticker.css('width', total_ticker_el_width + 'px');


    // set dimensions the ticker mask
    var firstTickerItem = ticker.children().eq(0);
    this.firstItemWidth = firstTickerItem.outerWidth() + parseInt(firstTickerItem.css('marginLeft')) + parseInt(firstTickerItem.css('marginRight'));

    var tickerHeight = firstTickerItem.outerHeight();
    mask.css('height', tickerHeight + 'px');
    if (this.tickerWidth) {
      mask.css('width', this.tickerWidth + 'px');
    }
    else {
      mask.css('width', (total_ticker_el_width - 2*this.firstItemWidth) + 'px');
    }

    // hover behaviours and start scrolling
    var thisObj = this;
    $(this.element).hover(function () {
      thisObj.stopScrolling()
    }, function () {
      thisObj.startScrolling()
    });

    this.startScrolling();
  };


  // scroll the ticker
  Plugin.prototype.scroll = function() {
    this.currLeft += this.increment;

    // if first item has moved across enough then append it to end of list
    if (this.currLeft < (this.firstItemWidth * -1) - this.pixelBuffer) {
      var item = $(this.element).children("li").eq(0).remove();
      $(this.element).append(item);
      this.currLeft += this.firstItemWidth;
      this.firstItemWidth = item.outerWidth() + parseInt(item.css('marginLeft')) + parseInt(item.css('marginRight'));
    }

    // shift the ticker across
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
