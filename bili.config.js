const babel = require('rollup-plugin-babel')
const vue = require('rollup-plugin-vue')

module.exports = {
  name: 'vue-headroom',
  moduleName: 'vueHeadroom',
  input: 'src/index.js',
  format: ['cjs', 'umd', 'umd-min', 'es', 'iife'],
  plugins: [
    vue({
      compileTemplate: true
    }),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [
        [
          'es2015',
          {
            'modules': false
          }
        ],
        'stage-2'
      ]
    })
  ],
  banner: {
    year: 2016
  }
}
