(function ($) {
  const dataKey = 'overlay-popup'

  class Popup {
    constructor (options, jqueryObject) {
      this.options = $.extend({
        callBtn: false,
        beforeShow: function () {},
        beforeHide: function () {},
        afterInit: function () {},
        closeBtn: 'default',
        position: 'center',
        overlayColor: 'rgba(0,0,0,.7)',
        popupColor: '#ffffff',
        width: '80%',
        height: '80%'
      }, options)

      this.overlay = jqueryObject
      this.id = Popup.generateId()

      this.eventShow = this.id + ':show'
      this.eventHide = this.id + ':hide'
      this.closeClick = 'click.overlay-popup'

      this.initClass = 'op-init'
      this.wrClass = 'op-wr'
      this.contentClass = 'op-content'
      this.switchClass = 'op-display'
      this.dataAttr = 'data-op-id'
    }

    static generateId () {
      let s = ''
      while (s.length < 10 && 10 > 0) {
        let r = Math.random()
        s += (r < 0.1 ? Math.floor(r * 100) : String.fromCharCode(Math.floor(r * 26) + (r > 0.5 ? 97 : 65)))
      }
      return s
    }

    initPopup () {
      try {
        let popup = this,
          overlay = this.overlay,
          srcHtml = overlay.html()

        /* create html */
        overlay.addClass(this.initClass).attr(this.dataAttr, this.id)
        overlay.html('<div class="' + this.wrClass + '"><div class="' + this.contentClass + ' ' +
          'op-' + this.options.position + '">' + srcHtml + '</div>')

        /* apply style options */
        overlay.css({backgroundColor: this.options.overlayColor})
        $('.' + this.contentClass, overlay).css({
          backgroundColor: this.options.popupColor,
          width: this.options.width,
          height: this.options.height
        })

        /* bind events */
        $(document).on(this.eventShow, function () {
          /* before show callback */
          if (popup.options.beforeShow && typeof popup.options.beforeShow === 'function') {
            popup.options.beforeShow()
          }

          overlay.addClass(popup.switchClass)
          $('body').css('overflow', 'hidden')
        })

        $(document).on(this.eventHide, function () {
          /* before hide callback */
          if (popup.options.beforeHide && typeof popup.options.beforeHide === 'function') {
            popup.options.beforeHide()
          }

          overlay.removeClass(popup.switchClass)
          $('body').css('overflow', 'visible')
        })

        popup.options.callBtn.on('click', function () {
          $(document).trigger(popup.eventShow)
        })

        /* close overlay popup button */
        if (this.options.closeBtn) {
          this.btnObj = $('<div class="op-close"><div class="op-close-in"></div></div>')

          if (this.options.closeBtn === 'default') {
            $('.op-content', overlay).prepend(this.btnObj)
          } else {
            this.btnObj = $(this.options.closeBtn)
          }

          this.btnObj.bind(this.closeClick, function () {
            $(document).trigger(popup.eventHide)
          })
        }

        /* save data */
        this.overlay.data(dataKey, this)

        /* after init callback */
        if (popup.options.afterInit && typeof popup.options.afterInit === 'function') {
          popup.options.afterInit(overlay)
        }
      } catch (e) {
        console.log(e)
      }
    }

    destroyPopup (options) {
      let destrOptions = $.extend({
        beforeDestroy: function () {},
        afterDestroy: function () {}
      }, options)

      /* before destroy callback */
      if (destrOptions.beforeDestroy && typeof destrOptions.beforeDestroy === 'function') {
        destrOptions.beforeDestroy(this.overlay)
      }

      /* unbind events */
      $(document).unbind(this.eventShow)
      $(document).unbind(this.eventHide)
      this.btnObj.unbind(this.closeClick)

      /* revert html */
      this.btnObj.remove()
      this.overlay.removeClass(this.overlay).removeAttr(this.dataAttr + ' style')
      this.overlay.html($('.' + this.contentClass, this.overlay).html())

      /* remove data */
      this.overlay.removeData(dataKey)

      /* after destroy callback */
      if (destrOptions.afterDestroy && typeof destrOptions.afterDestroy === 'function') {
        destrOptions.afterDestroy()
      }
    }
  }

  let methods = {
    init: function (options) {
      return this.each(function () {
        let popup = new Popup(options, $(this))

        popup.initPopup()
      })
    },

    destroy: function (options) {
      return this.each(function () {
        let popup = $(this).data(dataKey)

        popup.destroyPopup(options)
      })
    }
  }

  if (!$.fn.hasOwnProperty('overlayPopup')) {
    $.fn.overlayPopup = function (method) {
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1))
      } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments)
      } else {
        $.error('jQuery Overlay-popup doesn\'t know method ' + method)
      }
    }
  }
}(jQuery))
