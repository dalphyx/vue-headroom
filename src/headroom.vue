<template>
  <div :style="{ height: height + 'px' }">
    <div :class="cls" :style="style" ref="main">
      <slot>test</slot>
    </div>
  </div>
</template>

<script>
import checkActions from './checkActions'
import support3d from './support3d'
import {computed, defineComponent, nextTick, onBeforeUnmount, onMounted, onUpdated, ref, toRef, watch} from "vue";

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

export default defineComponent({
  name: 'vueHeadroom',
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

  setup(props,{emit,slots}){
    const isTop = ref(false)
    const isNotTop = ref(false)
    const isBottom = ref(false)
    const isNotBottom = ref(false)
    const isPinned = ref(false)
    const isUnpinned = ref(false)
    const currentScrollY = ref(0)
    const lastScrollY = ref(undefined)
    const state = ref('unfixed')
    const translate = ref(0)
    const height = ref('')
    const animation = ref(true)
    const isSupport3d = ref(false)
    const main = ref(null)
    onMounted(()=>{
      isSupport3d.value = support3d()
      _setHeightOffset()

      if (!props.disabled) {
        props.scroller().addEventListener('scroll', _handleScroll)
      }

      // When headroom is mounted, call handleScroll to set initial state.
      _handleScroll()
    })
    onUpdated(()=>{
      nextTick(function () {
        _setHeightOffset()
      })
    })

    onBeforeUnmount(()=>{
      props.scroller().removeEventListener('scroll', _handleScroll)
    })

    const style = computed(()=> {
      let styles = {
        'position': props.disabled || state.value === 'unfixed'
          ? 'relative'
          : 'fixed',
        'top': '0',
        'left': '0',
        'right': '0',
        'z-index': props.zIndex
      }

      if (props.footroom) {
        styles = { ...styles, 'top': 'unset', 'bottom': '0' }
      }

      // SSR cannot detect scroll position. To prevent flash when component mounted,
      // just add transition styles in browser.
      const isServer = typeof window === 'undefined';
      if (!isServer) {
        styles.transform = isSupport3d.value && !isServer
          ? `translate3d(0, ${translate.value}, 0)`
          : `translateY(${translate.value})`

        if (animation.value) {
          styles.transition = `all ${props.speed}ms ${props.easing}`
        }
      }

      return styles
    })
    const clsOpts = computed(()=> {
      return {
        ...defaultCls,
        ...props.classes
      }
    })
    const cls = computed(()=> {
        let cls = clsOpts.value
        return props.disabled
          ? {}
          : {
            [cls.top]: isTop.value,
            [cls.notTop]: isNotTop.value,
            [cls.bottom]: isBottom.value,
            [cls.notBottom]: isNotBottom.value,
            [cls.pinned]: isPinned.value,
            [cls.unpinned]: isUnpinned.value,
            [cls.initial]: true
          }
      }
    )
    const _getViewportHeight= () => {
      return window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight
    }

    const _getElementPhysicalHeight= elm => Math.max(elm.offsetHeight,elm.clientHeight)

    const _getDocumentHeight= () => {
      const body = document.body
      const documentElement = document.documentElement

      return Math.max(
        body.scrollHeight, documentElement.scrollHeight,
        body.offsetHeight, documentElement.offsetHeight,
        body.clientHeight, documentElement.clientHeight
      )
    }

    const _getElementHeight = elm => Math.max(
      elm.scrollHeight,
      elm.offsetHeight,
      elm.clientHeight
    )

    function _getScrollerPhysicalHeight () {
      const parent = props.scroller()

      return (parent === window || parent === document.body)
        ? _getViewportHeight()
        : _getElementPhysicalHeight(parent)
    }

    function _getScrollerHeight () {
      const parent = props.scroller()

      return (parent === window || parent === document.body)
        ? _getDocumentHeight()
        : _getElementHeight(parent)
    }

    function _isOutOfBound (currentScrollY) {
      const pastTop = currentScrollY < 0

      const scrollerPhysicalHeight = _getScrollerPhysicalHeight()
      const scrollerHeight = _getScrollerHeight()

      const pastBottom = currentScrollY + scrollerPhysicalHeight > scrollerHeight

      return pastTop || pastBottom
    }

    function _handleScroll () {
      window.requestAnimationFrame(update)
    }

    function _setHeightOffset () {
      height.value = main.value?.offsetHeight ??""
      // height.value = slots.default
      //   ? slots.default()[0].elm && slots.default()[0].elm.offsetHeight
      //   : ''
    }

    function _getScrollY () {
      let top
      if (props.scroller().pageYOffset !== undefined) {
        top = props.scroller().pageYOffset
      } else if (props.scroller().scrollTop !== undefined) {
        top = props.scroller().scrollTop
      } else {
        top = (
          document.documentElement ||
          document.body.parentNode ||
          document.body
        ).scrollTop
      }
      return top
    }

    function update () {
      currentScrollY.value = _getScrollY()

      if (_isOutOfBound(currentScrollY.value)) {
        return
      }

      if (currentScrollY.value <= props.offset) {
        top()
      } else {
        notTop()
      }

      if (currentScrollY.value + _getViewportHeight() >= _getScrollerHeight()) {
        bottom()
      } else {
        notBottom()
      }

      const action = checkActions({
        currentScrollY,
        lastScrollY,
        height,
        offset:toRef(props.offset),
        downTolerance:toRef(props.downTolerance),
        upTolerance:toRef(props.upTolerance),
        state

      })

      if (action === 'pin') {
        pin()
      } else if (action === 'unpin-snap') {
        unpinSnap()
      } else if (action === 'unpin') {
        unpin()
      } else if (action === 'unfix') {
        unfix()
      }
      lastScrollY.value = currentScrollY.value
    }

    function top () {
      isTop.value = true
      isNotTop.value = false
      emit('top')
    }

    function notTop () {
      isTop.value = false
      isNotTop.value = true
      emit('not-top')
    }

    function bottom () {
      isBottom.value = true
      isNotBottom.value = false
      emit('bottom')
    }

    function notBottom () {
      isNotBottom.value = true
      isBottom.value = false
      emit('not-bottom')
    }

    function pin () {
      isPinned.value = true
      isUnpinned.value = false
      animation.value = true
      emit('pin')
      translate.value = 0
      nextTick(() => {
        state.value = 'pinned'
      })
    }

    function unpin () {
      isUnpinned.value = true
      isPinned.value = false
      animation.value = true
      emit('unpin')
      translate.value = props.footroom ? '100%' : '-100%'
      nextTick(() => {
        state.value = 'unpinned'
      })
    }

    function unpinSnap () {
      isUnpinned.value = true
      isPinned.value = false
      animation.value = false
      emit('unpin')
      translate.value = props.footroom ? '100%' : '-100%'
      nextTick(() => {
        state.value = 'unpinned'
      })
    }

    function unfix () {
      translate.value = 0
      animation.value = false
      emit('unfix')
      nextTick(() => {
        state.value = 'unfixed'
      })
    }
    watch(()=>props.disabled, (newVal) =>{
      if (newVal) {
        props.scroller().removeEventListener('scroll', _handleScroll)
      } else {
        props.scroller().addEventListener('scroll', _handleScroll)
      }
    })

    return {
      main,
      height,
      cls,
      style
    }
  }

})
</script>
