(function ($) {
  function randString(x) {
    var s = "";
    while(s.length<x&&x>0){
      var r = Math.random();
      s+= (r<0.1?Math.floor(r*100):String.fromCharCode(Math.floor(r*26) + (r>0.5?97:65)));
    }
    return s;
  }

  var methods = {
    init: function (options) {
      //merge options
      var opts = $.extend({
        beforeShow: function() {},
        beforeHide: function() {},
        closeBtnId: false,
        afterInit: function() {}
      }, options);

      return this.each(function() {
        /**
         * start init overlay
         */
        var overlay   = $(this),
          switchClass = 'op-display',
          content     = overlay.html(),
          btnObj      = '',
          overlayId   = randString(10);

        overlay.addClass('op-init').attr('id', overlayId);
        overlay.html('<div class="op-content">' + content + '</div>');

        /**
         * custom events
         */
        $(document).on(overlayId + ":show", function () {
          /**
           * before overlay show callback
           */
          if (opts.beforeShow && typeof opts.beforeShow == "function") {
            opts.beforeShow();
          }

          overlay.addClass(switchClass);
          $("body").css("overflow", "hidden");
        });

        $(document).on(overlayId + ":hide", function () {
          /**
           * before overlay hide callback
           */
          if (opts.beforeHide && typeof opts.beforeHide == "function") {
            opts.beforeHide();
          }

          overlay.removeClass(switchClass);
          $("body").css("overflow", "visible");
        });

        /**
         * close overlay popup
         */
        if (opts.closeBtnId) {
          btnObj = $('#' + opts.closeBtnId);
        } else {
          $('.op-content', overlay).prepend('<div class="op-close"><div class="op-close-in"></div></div>');
          btnObj = $('.op-close');
        }

        //hide popup
        btnObj.bind('click.overlay-popup', function () {
          $(document).trigger(overlayId + ":hide");
        });

        /**
         * save data
         */
        opts.overlay = overlay;
        opts.swClass = switchClass;
        opts.btnObj = btnObj;

        $(this).data('overlay-popup', opts);

        /**
         * after init callback
         */
        if (opts.afterInit && typeof opts.afterInit == "function") {
          opts.afterInit(overlay);
        }
      });
    },
    destroy: function (options) {
      //merge options
      var settings = $.extend({
        afterDestroy: function () {
        }
      }, options);

      return this.each(function() {
        var $this = $(this),
          opts = $this.data('overlay-popup'),
          opContWr = $('.op-content', $this),
          html = opContWr.html();

        //unbind nav click event
        opts.btnObj.unbind('.overlay-popup').remove();

        //return html structure
        opContWr.remove();
        $(this).removeClass('op-init').html(html);

        //remove data
        $this.removeData('overlay-popup');

        /**
         * after destroy callback
         */
        if (settings.afterDestroy && typeof settings.afterDestroy == "function") {
          settings.afterDestroy();
        }
      });
    }
  };

  if (!$.fn.hasOwnProperty('overlayPopup')) {
    $.fn.overlayPopup = function (method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('jQuery Overlay-popup doesn\'t know method ' + method);
    }
  };
  }
}(jQuery));
