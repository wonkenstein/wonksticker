// http://coding.smashingmagazine.com/2011/10/11/essential-jquery-plugin-patterns/
;(function ( $, window, document, undefined ) {

  // Create the defaults once
  var pluginName = 'wonksticker',
    defaults = {
      increment : -2, // smoothness of the scrolling
      speed : 30, // higher the number, the slower it is
      tickerBuffer : 30,
      width: 0,
      height: 0,
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
    this.tickerHeight = this.options.height;
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

		if (this.scroll == 'Up' || this.scroll == 'Down') {
			this.verticalTickerStyle(ticker, mask);
		}
		else {
			this.horizontalTickerStyle(ticker, mask);
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


  // scroll direction taken from options.scroll
  Plugin.prototype.startScrolling = function() {
    var thisObj = this;

    this.tickerInterval = window.setInterval(function () {
    	if ($.isFunction(thisObj['scroll'+thisObj.scroll])) {
    		thisObj['scroll'+thisObj.scroll]();
    	}

    }, this.speed)
  };


  // stop/pause the ticker
  Plugin.prototype.stopScrolling = function() {
    window.clearInterval(this.tickerInterval);
  };


	// STYLE FUNCTIONS
	// set up the styles for a horizontal ticker
	Plugin.prototype.horizontalTickerStyle = function(ticker, mask) {

		// float the li elements
		$('li', ticker).each(function(i){
			$(this).css('float', 'left');
		});

		this._getTickerDimensions(ticker);
		var tickerMaskWidth = (this.tickerWidth)
											|| (this.dimensions.tickerTapeLength - (2*this.dimensions.itemMaxWidth));

    ticker.css('width', this.dimensions.tickerTapeLength + 'px');

    // set dimensions the ticker mask
    mask.css('height', this.dimensions.itemMaxHeight + 'px');
    mask.css('width', tickerMaskWidth + 'px');
	};


	// set up styles for a vertical ticker
	Plugin.prototype.verticalTickerStyle = function(ticker, mask) {
		this._getTickerDimensions(ticker);

		var tickerMaskHeight = (this.tickerHeight)
											|| (this.dimensions.tickerTapeLength - (2*this.dimensions.itemMaxHeight));

    ticker.css('height', this.dimensions.tickerTapeLength + 'px');

    // set dimensions the ticker mask
    mask.css('height', tickerMaskHeight + 'px');
    mask.css('width', this.dimensions.itemMaxWidth + 10 + 'px');
	}


	// SCROLLING FUNCTIONS
  // scroll the ticker left
  Plugin.prototype.scrollLeft = function() {
    this.currPos += this.increment;

    // if first item has moved across enough then append it to end of list
    if (this.currPos < (this.dimensions.itemMaxWidth * -1) - this.tickerBuffer) {
      var item = $(this.element).children("li").eq(0).remove();
      $(this.element).append(item);
      this.currPos += this.dimensions.itemMaxWidth;
    }

    // shift the ticker across left
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


  // scroll the ticker up
  Plugin.prototype.scrollUp = function() {
    this.currPos += this.increment;

    // if first item has moved up enough then append it to end of list
    if (this.currPos < (this.dimensions.itemMaxHeight * -1) - this.tickerBuffer) {
      var item = $(this.element).children("li").eq(0).remove();
      $(this.element).append(item);
      this.currPos += this.dimensions.itemMaxHeight;
    }

    // shift the ticker across up
    $(this.element).css("top", this.currPos + "px");
  };


  // scroll the ticker down
  Plugin.prototype.scrollDown = function() {
    this.currPos += this.increment;

    // if first item has moved down enough then append it to end of list
    if (this.currPos < ((this.dimensions.itemMaxHeight * -1) - this.tickerBuffer)) {
      var item = $(this.element).children("li").last().remove();
      $(this.element).prepend(item);
      this.currPos += this.dimensions.itemMaxHeight;
    }

    // shift the ticker down
    $(this.element).css("bottom", this.currPos + "px");
  };


	// DIMENSION FUNCTIONS
	// get the dimensions of the ticker
	Plugin.prototype._getTickerDimensions = function(ticker) {
		var thisObj = this;

    $('li', ticker).each(function(i){
    	var w = thisObj._getElementWidth($(this));
    	var h = thisObj._getElementHeight($(this));

			if (thisObj.scroll == 'Up' || thisObj.scroll == 'Down') {
				thisObj.dimensions.tickerTapeLength += h;
			}
			else {
				thisObj.dimensions.tickerTapeLength += w;
			}

      if (thisObj.dimensions.itemMaxWidth < w) {
      	thisObj.dimensions.itemMaxWidth = w;
      }
      if (thisObj.dimensions.itemMaxHeight < h) {
      	thisObj.dimensions.itemMaxHeight = h;
      }
    });

    if (this.scroll == 'Up' || this.scroll == 'Down') {
    	this.tickerBuffer = parseInt(this.dimensions.itemMaxHeight/2);
    }
    else {
	    this.tickerBuffer = parseInt(this.dimensions.itemMaxWidth/2);
    }

    thisObj.dimensions.tickerTapeLength += this.tickerBuffer // add on buffer so IE behaves
	};


  // helper to get the width of an element including the margins
  Plugin.prototype._getElementWidth = function(el) {
  	el = $(el);
  	return el.outerWidth() + parseInt(el.css('marginLeft')) + parseInt(el.css('marginRight'));
  };


  // helper to get the height of an element including the margins
  Plugin.prototype._getElementHeight = function(el) {
  	el = $(el);
  	return el.height() + parseInt(el.css('marginTop')) + parseInt(el.css('marginBottom'));
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
