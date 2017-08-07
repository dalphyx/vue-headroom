import headroom from './headroom.vue'

const install = function (Vue, opt = {}) {
  if (install.installed) {
    return
  }

  Vue.component('vue-headroom', headroom)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  headroom,
  install
}
