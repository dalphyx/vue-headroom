<template>
  <div :class="cls" :style="style">
    <slot></slot>
  </div>
</template>

<script>
import raf from 'raf'
import checkActions from './checkActions'
import support3d from './support3d'

const defaultCls = {
  pinned: 'headroom--pinned',
  unpinned: 'headroom--unpinned',
  top: 'headroom--top',
  notTop: 'headroom--not-top',
  bottom: 'headroom--bottom',
  notBottom: 'headroom--not-bottom',
  initial: 'headroom'
}

export default {
  name: 'vueHeadroom',

  data () {
    return {
      isTop: false,
      isNotTop: false,
      isBottom: false,
      isNotBottom: false,
      isPinned: false,
      isUnpinned: false,
      currentScrollY: 0,
      lastScrollY: 0,
      state: '',
      translate: 0,
      isSupport3d: false
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
    },

    classes: {
      type: Object,
      default () {
        return defaultCls
      }
    }
  },

  watch: {
    disabled (newVal) {
      if (newVal) {
        this.scroller().removeEventListener('scroll', this._handleScroll)
      } else {
        this.scroller().addEventListener('scroll', this._handleScroll)
      }
    }
  },

  mounted () {
    this.isSupport3d = support3d()

    if (!this.disabled) {
      this.scroller().addEventListener('scroll', this._handleScroll)
    }

    // When headroom is mounted, call handleScroll to set initial state.
    this._handleScroll()
  },

  beforeDestroy () {
    this.scroller().removeEventListener('scroll', this._handleScroll)
  },

  computed: {
    style () {
      let styles = {
        'position': this.isInTop ? 'fixed' : 'relative',
        'top': '0',
        'left': '0',
        'right': '0',
        'z-index': this.isInTop ? this.zIndex : 1
      }

      // SSR cannot detect scroll position. To prevent flash when component mounted,
      // just add transition styles in browser.
      if (!this.$isServer) {
        styles.transform = this.isSupport3d && !this.$isServer
          ? `translate3d(0, ${this.translate}, 0)`
          : `translateY(${this.translate})`

        styles.transition = this.isInTop ? `all ${this.speed}ms ${this.easing}` : null
      }

      return styles
    },

    clsOpts () {
      return {
        ...defaultCls,
        ...this.classes
      }
    },

    cls () {
      let cls = this.clsOpts
      return this.disabled
        ? {}
        : {
          [cls.top]: this.isTop,
          [cls.notTop]: this.isNotTop,
          [cls.bottom]: this.isBottom,
          [cls.notBottom]: this.isNotBottom,
          [cls.pinned]: this.isPinned,
          [cls.unpinned]: this.isUnpinned,
          [cls.initial]: true
        }
    },

    isInTop () {
      return this.state === 'pinned' || this.state === 'unpinned'
    }
  },

  methods: {
    _getViewportHeight: () => {
      return window.innerHeight
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
        top = (
          document.documentElement ||
          document.body.parentNode ||
          document.body
        ).scrollTop
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
      }

      this.lastScrollY = this.currentScrollY
    },

    top () {
      if (!this.isTop) {
        this.isTop = true
        this.isNotTop = false
        this.onTop && this.onTop()
      }
    },

    notTop () {
      if (!this.isNotTop) {
        this.isTop = false
        this.isNotTop = true
        this.onNotTop && this.onNotTop()
      }
    },

    bottom () {
      if (!this.isBottom) {
        this.isBottom = true
        this.isNotBottom = false
        this.onBottom && this.onBottom()
      }
    },

    notBottom () {
      if (!this.isNotBottom) {
        this.isNotBottom = true
        this.isBottom = false
        this.onNotBottom && this.onNotBottom()
      }
    },

    pin () {
      if (!this.isPinned) {
        this.isPinned = true
        this.isUnpinned = false
        this.onPin && this.onPin()
        this.$emit('pin')
        this.translate = 0
        setTimeout(() => {
          this.state = 'pinned'
        }, 0)
      }
    },

    unpin () {
      if (this.isPinned || !this.isUnpinned) {
        this.isUnpinned = true
        this.isPinned = false
        this.onUnpin && this.onUnpin()
        this.$emit('unpin')
        this.translate = '-100%'
        setTimeout(() => {
          this.state = 'unpinned'
        }, 0)
      }
    }
  }

}
</script>
