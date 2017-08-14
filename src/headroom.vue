<template>
  <div class="headroom" :style="style">
    <slot></slot>
  </div>
</template>

<script>
import raf from 'raf'
import checkActions from './checkActions'
import support3d from './support3d'

export default {
  name: 'vueHeadroom',

  data () {
    return {
      currentScrollY: 0,
      lastScrollY: 0,
      state: '',
      translate: 0,
      isSupport3d: support3d()
    }
  },

  props: {
    scroller: {
      type: Function,
      default: () => window
    },

    disabled: {
      type: Boolean,
      default: false
    },

    upTolerance: {
      type: Number,
      default: 5
    },

    downTolerance: {
      type: Number,
      default: 0
    },

    speed: {
      type: Number,
      default: 250
    },

    easing: {
      type: String,
      default: 'ease-in-out'
    },

    zIndex: {
      type: Number,
      default: 9999
    },

    onPin: Function,
    onUnpin: Function,
    onTop: Function,
    onNotTop: Function,
    onBottom: Function,
    onNotBottom: Function,

    offset: {
      type: Number,
      default: 0
    }
  },

  watch: {
    disabled (newVal) {
      if (newVal) {
        this.unfix()
        this.scroller().removeEventListener('scroll', this._handleScroll)
      } else {
        this.scroller().addEventListener('scroll', this._handleScroll)
      }
    }
  },

  mounted () {
    if (!this.disabled) {
      this.scroller().addEventListener('scroll', this._handleScroll)
    }
  },

  beforeDestroy () {
    this.scroller().removeEventListener('scroll', this._handleScroll)
  },

  computed: {
    style () {
      return {
        'position': this.isInTop ? 'fixed' : 'relative',
        'top': '0',
        'left': '0',
        'right': '0',
        'z-index': this.isInTop ? this.zIndex : 1,
        'transform': this.isSupport3d
          ? `translate3d(0, ${this.translate}, 0)`
          : `translateY(${this.translate})`,
        'transition': this.isInTop ? `all ${this.speed}ms ${this.easing}` : null
      }
    },

    isInTop () {
      return this.state === 'pinned' || this.state === 'unpinned'
    }
  },

  methods: {
    _getViewportHeight: () => {
      window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight
    },

    _getElementPhysicalHeight: elm => Math.max(
      elm.offsetHeight,
      elm.clientHeight
    ),

    _getDocumentHeight: () => {
      const body = document.body
      const documentElement = document.documentElement

      return Math.max(
        body.scrollHeight, documentElement.scrollHeight,
        body.offsetHeight, documentElement.offsetHeight,
        body.clientHeight, documentElement.clientHeight
      )
    },

    _getElementHeight: elm => Math.max(
      elm.scrollHeight,
      elm.offsetHeight,
      elm.clientHeight
    ),

    _getScrollerPhysicalHeight () {
      const parent = this.scroller()

      return (parent === window || parent === document.body)
        ? this._getViewportHeight()
        : this._getElementPhysicalHeight(parent)
    },

    _getScrollerHeight () {
      const parent = this.scroller()

      return (parent === window || parent === document.body)
        ? this._getDocumentHeight()
        : this._getElementHeight(parent)
    },

    _isOutOfBound (currentScrollY) {
      const pastTop = currentScrollY < 0

      const scrollerPhysicalHeight = this._getScrollerPhysicalHeight()
      const scrollerHeight = this._getScrollerHeight()

      const pastBottom = currentScrollY + scrollerPhysicalHeight > scrollerHeight

      return pastTop || pastBottom
    },

    _handleScroll () {
      raf(this.update)
    },

    _getScrollY () {
      let top
      if (this.scroller().pageYOffset !== undefined) {
        top = this.scroller().pageYOffset
      } else if (this.scroller().scrollTop !== undefined) {
        top = this.scroller().scrollTop
      } else {
        top = (document.documentElement || document.body.parentNode || document.body).scrollTop
      }
      return top
    },

    update () {
      this.currentScrollY = this._getScrollY()

      if (this._isOutOfBound(this.currentScrollY)) {
        return
      }

      if (this.currentScrollY <= this.offset) {
        this.top()
      } else {
        this.notTop()
      }


      if (this.currentScrollY +
        this._getViewportHeight() >= this._getScrollerHeight()) {
        this.bottom()
      } else {
        this.notBottom()
      }

      const action = checkActions(this)

      if (action === 'pin') {
        this.pin()
      } else if (action === 'unpin') {
        this.unpin()
      } else if (action === 'unfix') {
        this.unfix()
      }

      this.lastScrollY = this.currentScrollY
    },

    top () {
      if (this.onTop) {
        this.onTop()
      }
    },

    notTop () {
      if (this.onNotTop) {
        this.onNotTop()
      }
    },

    bottom () {
      if (this.onBottom) {
        this.onBottom()
      }
    },

    notBottom () {
      if (this.onNotBottom) {
        this.onNotBottom()
      }
    },

    pin () {
      this.$emit('pin')

      if (this.onPin) {
        this.onPin()
      }
      this.translate = 0
      setTimeout(() => {
        this.state = 'pinned'
      }, 0)
    },

    unpin () {
      this.$emit('unpin')

      if (this.onUnpin) {
        this.onUnpin()
      }
      this.translate = '-100%'
      setTimeout(() => {
        this.state = 'unpinned'
      }, 0)
    },

    unfix () {
      this.$emit('unfix')
      this.translate = 0
      this.state = 'unfixed'
    }
  }

}
</script>
