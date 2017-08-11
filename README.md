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

Height of progress bar. Default: `3`

`onPin`

Callback when header is pinned.

`onUnpin`

Callback when header is unpinned.

`pinStart`

Height in px where the header should start and stop pinning. Default: `0`

`zIndex`

The z-index of component. Default: `9999`

# License

[The MIT License](http://opensource.org/licenses/MIT)