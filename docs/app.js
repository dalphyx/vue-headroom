const md = new window.markdownit()

const props = document.querySelector('#props-content').innerHTML
const events = document.querySelector('#events-content').innerHTML

new Vue({
  el: '.page-container',
  data: {
    usage: md.render(`
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
    `),

    props: md.render(props),
    events: md.render(events)
  }
})
