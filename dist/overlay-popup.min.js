'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function ($) {
  var dataKey = 'overlay-popup';

  var Popup = function () {
    function Popup(options, jqueryObject) {
      _classCallCheck(this, Popup);

      this.options = $.extend({
        beforeShow: function beforeShow() {},
        beforeHide: function beforeHide() {},
        afterInit: function afterInit() {},
        closeBtn: 'default',
        position: 'center',
        overlayColor: 'rgba(0,0,0,.7)',
        popupColor: '#ffffff',
        width: '80%',
        height: '80%'
      }, options);

      this.overlay = jqueryObject;
      this.id = Popup.generateId();

      this.eventShow = this.id + ":show";
      this.eventHide = this.id + ":hide";
      this.closeClick = 'click.overlay-popup';

      this.initClass = 'op-init';
      this.wrClass = 'op-wr';
      this.contentClass = 'op-content';
      this.switchClass = 'op-display';
      this.dataAttr = 'data-op-id';
    }

    _createClass(Popup, [{
      key: 'initPopup',
      value: function initPopup() {
        var popup = this,
            overlay = this.overlay,
            srcHtml = overlay.html();

        /* create html */
        overlay.addClass(this.initClass).attr(this.dataAttr, this.id);
        overlay.html('<div class="' + this.wrClass + '"><div class="' + this.contentClass + ' ' + 'op-' + this.options.position + '">' + srcHtml + '</div>');

        /* apply style options */
        $('.' + this.initClass).css({ backgroundColor: this.options.overlayColor });
        $('.' + this.contentClass).css({
          backgroundColor: this.options.popupColor,
          width: this.options.width,
          height: this.options.height
        });

        /* bind events */
        $(document).on(this.eventShow, function () {
          /* before show callback */
          if (popup.options.beforeShow && typeof popup.options.beforeShow === "function") {
            popup.options.beforeShow();
          }

          overlay.addClass(popup.switchClass);
          $("body").css("overflow", "hidden");
        });

        $(document).on(this.eventHide, function () {
          /* before hide callback */
          if (popup.options.beforeHide && typeof popup.options.beforeHide === "function") {
            popup.options.beforeHide();
          }

          overlay.removeClass(popup.switchClass);
          $("body").css("overflow", "visible");
        });

        /* close overlay popup button */
        if (this.options.closeBtn) {
          this.btnObj = $('<div class="op-close"><div class="op-close-in"></div></div>');

          if ('default' === this.options.closeBtn) {
            $('.op-content', overlay).prepend(this.btnObj);
          } else {
            this.btnObj = $(this.options.closeBtn);
          }

          this.btnObj.bind(this.closeClick, function () {
            $(document).trigger(popup.eventHide);
          });
        }

        /* save data */
        this.overlay.data(dataKey, this);

        /* after init callback */
        if (popup.options.afterInit && typeof popup.options.afterInit === "function") {
          popup.options.afterInit(overlay);
        }
      }
    }, {
      key: 'destroyPopup',
      value: function destroyPopup() {
        /* unbind events */
        $(document).unbind(this.eventShow);
        $(document).unbind(this.eventHide);
        this.btnObj.unbind(this.closeClick);

        /* revert html */
        this.btnObj.remove();
        this.overlay.removeClass(this.initClass).removeAttr(this.dataAttr + ' style');
        this.overlay.html($('.' + this.contentClass, this.overlay).html());

        /* remove data */
        this.overlay.removeData(dataKey);
      }
    }], [{
      key: 'generateId',
      value: function generateId() {
        var s = "";
        while (s.length < 10 && 10 > 0) {
          var r = Math.random();
          s += r < 0.1 ? Math.floor(r * 100) : String.fromCharCode(Math.floor(r * 26) + (r > 0.5 ? 97 : 65));
        }
        return s;
      }
    }]);

    return Popup;
  }();

  var methods = {
    init: function init(options) {
      return this.each(function () {
        var popup = new Popup(options, $(this));

        popup.initPopup();
      });
    },

    destroy: function destroy() {
      return this.each(function () {
        var popup = $(this).data(dataKey);

        popup.destroyPopup();
      });
    }
  };

  if (!$.fn.hasOwnProperty('overlayPopup')) {
    $.fn.overlayPopup = function (method) {
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if ((typeof method === 'undefined' ? 'undefined' : _typeof(method)) === 'object' || !method) {
        return methods.init.apply(this, arguments);
      } else {
        $.error('jQuery Overlay-popup doesn\'t know method ' + method);
      }
    };
  }
})(jQuery);