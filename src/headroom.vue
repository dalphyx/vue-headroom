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

    pinStart: {
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

    pin () {
      this.$emit('fix')

      if (this.onPin) {
        this.onPin()
      }
      this.translate = 0
      setTimeout(() => {
        this.state = 'pinned'
      }, 0)
    },

    unpin () {
      this.$emit('fix')

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
