// http://coding.smashingmagazine.com/2011/10/11/essential-jquery-plugin-patterns/
;(function ( $, window, document, undefined ) {

  // Create the defaults once
  var pluginName = 'wonksticker',
    defaults = {
      increment : -2, // smoothness of the scrolling
      speed : 30, // higher the number, the slower it is
      tickerBuffer : 30,
      width: 0,
      scroll: 'left',
    };

  // The actual plugin constructor
  function Plugin( element, options ) {
    this.element = element;
    this.options = $.extend( {}, defaults, options) ;

    this._defaults = defaults;
    this._name = pluginName;

    this.increment = this.options.increment;
    this.speed = this.options.speed;
    this.tickerBuffer = this.options.tickerBuffer;
    this.tickerWidth = this.options.width;
    this.scroll = this.options.scroll;

    // captialise the scroll to use for function names
    this.scroll = this.scroll.charAt(0).toUpperCase() + this.scroll.slice(1);

    this.dimensions = {
    	itemMaxWidth : 0,
    	itemMaxHeight : 0,
    	tickerTapeLength : 0,
    };

    this.currPos = 0;
    this.tickerInterval = 0;
    this.firstItemWidth = 0;

		// do something interesting
    this.init();
  }


	//
  Plugin.prototype.init = function () {
    var ticker = $(this.element);
    var thisObj = this;

    // set up ticker html and css
    ticker.wrap('<div class="ticker-mask" />');
    ticker.css('position', 'absolute');
    ticker.css('margin', '0');
    ticker.css('padding', '0');

		// set up ticker mask css
    var mask = ticker.parent();
    mask.css('position', 'relative');
    mask.css('overflow', 'hidden');

		this.horizontalTickerStyle(ticker, mask);

    // hover behaviours and start scrolling
    var thisObj = this;
    $(this.element).hover(function () {
      thisObj.stopScrolling()
    }, function () {
      thisObj.startScrolling()
    });

    this.startScrolling();
  };


	// get the dimensions of the ticker
	Plugin.prototype._getTickerDimensions = function(ticker) {
		var thisObj = this;

    $('li', ticker).each(function(i){
    	var w = thisObj._getElementWidth($(this));
    	var h = $(this).height();

      thisObj.dimensions.tickerTapeLength += w;

      if (thisObj.dimensions.itemMaxWidth < w) {
      	thisObj.dimensions.itemMaxWidth = w;
      }
      if (thisObj.dimensions.itemMaxHeight < h) {
      	thisObj.dimensions.itemMaxHeight = h;
      }
    });

    thisObj.dimensions.tickerTapeLength += this.tickerBuffer // add on buffer so IE behaves
	};


	// set up the styles for a horizontal ticker
	Plugin.prototype.horizontalTickerStyle = function(ticker, mask) {

		this._getTickerDimensions(ticker);
		var tickerMaskWidth = (this.tickerWidth)
											|| (this.dimensions.tickerTapeLength - (2*this.dimensions.itemMaxWidth));

    ticker.css('width', this.dimensions.tickerTapeLength + 'px');

    // set dimensions the ticker mask
    mask.css('height', this.dimensions.itemMaxHeight + 'px');
    mask.css('width', tickerMaskWidth + 'px');
	};


  // scroll the ticker left
  Plugin.prototype.scrollLeft = function() {
    this.currPos += this.increment;

    // if first item has moved across enough then append it to end of list
    if (this.currPos < (this.dimensions.itemMaxWidth * -1) - this.tickerBuffer) {
      var item = $(this.element).children("li").eq(0).remove();
      $(this.element).append(item);
      this.currPos += this.dimensions.itemMaxWidth;
    }

    // shift the ticker across right
    $(this.element).css("left", this.currPos + "px");
  };


  // scroll the ticker right
  Plugin.prototype.scrollRight = function() {
    this.currPos += this.increment;

    // if first item has moved across enough then append it to end of list
    if (this.currPos < ((this.dimensions.itemMaxWidth * -1) - this.tickerBuffer)) {
      var item = $(this.element).children("li").last().remove();
      $(this.element).prepend(item);
      this.currPos += this.dimensions.itemMaxWidth;
    }

    // shift the ticker across
    $(this.element).css("right", this.currPos + "px");
  };


  // scroll direction taken from options.scroll
  Plugin.prototype.startScrolling = function() {
    var thisObj = this;

    this.tickerInterval = window.setInterval(function () {
      thisObj['scroll'+thisObj.scroll]();
    }, this.speed)
  };


  //
  Plugin.prototype.stopScrolling = function() {
    window.clearInterval(this.tickerInterval);
  };

  // helper to get the wdth of an element including the margins
  Plugin.prototype._getElementWidth= function(el) {
  	el = $(el);
  	return el.outerWidth() + parseInt(el.css('marginLeft')) + parseInt(el.css('marginRight'));
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
