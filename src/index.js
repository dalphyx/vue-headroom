import headroom from './headroom.vue'

const install = function (Vue, opt = {}) {
  if (install.installed) {
    return
  }

  Vue.component(headroom.name, headroom)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  headroom,
  install
}
