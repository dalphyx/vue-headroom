import vue from 'rollup-plugin-vue';

export default {
    input: 'src/index.js',
    output: [{
      file: 'dist/vue-headroom-umd.js',
      name: 'vueHeadroom',
      format: 'umd'
    }, {
      file: 'dist/vue-headroom-es.js',
      format: 'es'
    }],
    plugins: [
      vue(),
    ],
};
