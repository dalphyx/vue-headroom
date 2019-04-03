# vue-headroom [![npm package](https://img.shields.io/npm/v/vue-headroom.svg)](https://www.npmjs.com/package/vue-headroom)

> Headroom for Vuejs.

# Requirements

- [Vue.js](https://github.com/vuejs/vue) `^2.0.0`

# Installation

``` bash
$ npm install vue-headroom
```

# Docs & Demo

[https://dalphyx.github.io/vue-headroom/](https://dalphyx.github.io/vue-headroom/)

# Usage
``` html
<template>
  <headroom>
    <header>
      Put your head code here...
    </header>
  </headroom>
</template>

<script>
import headroom from 'vue-headroom'

Vue.use(headroom)

// or
import { headroom } from 'vue-headroom'

export default {
  components: {
    headroom
  }
}
</script>
```

# Props

`speed`

Transition speed, in ms. Default: `350`

`easing`

Transition function. Default: `ease-in-out`

`disabled`

Disable the headroom. Default: false

`upTolerance`

Scroll tolerance when scrolling up before component is pinned, in px. Default: `5`

`downTolerance`

Scroll tolerance when scrolling down before component is pinned, in px. Default: `0`

`scroller`

Element to listen to scroll events on. Default: () => `window`

`classes`

Css classes to apply. Default:
```html
{
  // when element is initialised
  initial : "headroom",
  // when scrolling up
  pinned : "headroom--pinned",
  // when scrolling down
  unpinned : "headroom--unpinned",
  // when above offset
  top : "headroom--top",
  // when below offset
  notTop : "headroom--not-top",
  // when at bottom of scoll area
  bottom : "headroom--bottom",
  // when not at bottom of scroll area
  notBottom : "headroom--not-bottom"
}
```

`offset`

Height in px where the header should start and stop pinning. Default: `0`

`zIndex`

The z-index of component. Default: `9999`

`footroom`

Same behaviour but as a footer instead. Default: `false`

# Events

`pin`

Callback when header is pinned.

`unpin`

Callback when header is unpinned.

`unfix`

Callback when header is unfixed.

`top`

Callback when above offset.

`not-top`

Callback when below offset.

`bottom`

Callback when at bottom of page.

`not-bottom`

Callback when moving away from bottom of page.

# License

[The MIT License](http://opensource.org/licenses/MIT)
