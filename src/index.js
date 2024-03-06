import headroom from './headroom.vue'

const install = (app, options) => {
  app.component(headroom.name, headroom)
}
// If running in the browser and `window.Vue` is available, auto-install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}
// Export the component and the install function
export { headroom, install }
