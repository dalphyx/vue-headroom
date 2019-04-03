<template>
  <div :style="{ height: height + 'px' }">
    <div :class="cls" :style="style">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import raf from 'raf'
import checkActions from './checkActions'
import support3d from './support3d'

const defaultCls = {
  pinned: 'headroom--pinned',
  unpinned: 'headroom--unpinned',
  unfixed: 'headroom--unfixed',
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
      lastScrollY: undefined,
      state: 'unfixed',
      translate: 0,
      height: '',
      animation: true,
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

    offset: {
      type: Number,
      default: 0
    },

    classes: {
      type: Object,
      default () {
        return defaultCls
      }
    },

    footroom: {
      type: Boolean,
      default: false
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
    this._setHeightOffset()

    if (!this.disabled) {
      this.scroller().addEventListener('scroll', this._handleScroll)
    }

    // When headroom is mounted, call handleScroll to set initial state.
    this._handleScroll()
  },

  updated () {
    this.$nextTick(function () {
      this._setHeightOffset()
    })
  },

  beforeDestroy () {
    this.scroller().removeEventListener('scroll', this._handleScroll)
  },

  computed: {
    style () {
      let styles = {
        'position': this.disabled || this.state === 'unfixed'
          ? 'relative'
          : 'fixed',
        'top': '0',
        'left': '0',
        'right': '0',
        'z-index': this.zIndex
      }

      if (this.footroom) {
        styles = { ...styles, 'top': 'unset', 'bottom': '0' }
      }

      // SSR cannot detect scroll position. To prevent flash when component mounted,
      // just add transition styles in browser.
      if (!this.$isServer) {
        styles.transform = this.isSupport3d && !this.$isServer
          ? `translate3d(0, ${this.translate}, 0)`
          : `translateY(${this.translate})`

        if (this.animation) {
          styles.transition = `all ${this.speed}ms ${this.easing}`
        }
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

    _setHeightOffset () {
      this.height = this.$slots.default
        ? this.$slots.default[0].elm && this.$slots.default[0].elm.offsetHeight
        : ''
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
      } else if (action === 'unpin-snap') {
        this.unpinSnap()
      } else if (action === 'unpin') {
        this.unpin()
      } else if (action === 'unfix') {
        this.unfix()
      }

      this.lastScrollY = this.currentScrollY
    },

    top () {
      this.isTop = true
      this.isNotTop = false
      this.$emit('top')
    },

    notTop () {
      this.isTop = false
      this.isNotTop = true
      this.$emit('not-top')
    },

    bottom () {
      this.isBottom = true
      this.isNotBottom = false
      this.$emit('bottom')
    },

    notBottom () {
      this.isNotBottom = true
      this.isBottom = false
      this.$emit('not-bottom')
    },

    pin () {
      this.isPinned = true
      this.isUnpinned = false
      this.animation = true
      this.$emit('pin')
      this.translate = 0
      this.$nextTick(() => {
        this.state = 'pinned'
      })
    },

    unpin () {
      this.isUnpinned = true
      this.isPinned = false
      this.animation = true
      this.$emit('unpin')
      this.translate = this.footroom ? '100%' : '-100%'
      this.$nextTick(() => {
        this.state = 'unpinned'
      })
    },

    unpinSnap () {
      this.isUnpinned = true
      this.isPinned = false
      this.animation = false
      this.$emit('unpin')
      this.translate = this.footroom ? '100%' : '-100%'
      this.$nextTick(() => {
        this.state = 'unpinned'
      }) 
    },

    unfix () {
      this.translate = 0
      this.animation = false
      this.$emit('unfix')
      this.$nextTick(() => {
        this.state = 'unfixed'
      })
    }
  }
}
</script>
