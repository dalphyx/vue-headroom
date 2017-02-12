const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const vue = require('rollup-plugin-vue')
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')
const uglify = require('rollup-plugin-uglify')

rollup.rollup({
  entry: 'src/index.js',
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true
    }),
    vue({
      compileTemplate: true
    }),
    commonjs(),
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
    }),
    uglify()
  ]
}).then(bundle => {
  bundle.write({
    format: 'umd',
    moduleName: 'vueHeadroom',
    globals: {
      raf: 'raf'
    },
    dest: './dist/vue-headroom.min.js'
  })
})
