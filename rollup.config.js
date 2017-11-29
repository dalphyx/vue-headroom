const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const vue = require('rollup-plugin-vue')
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')
const pkg = require('./package.json')

const now = new Date()

export default {
  name: 'vueHeadroom',
  input: 'src/index.js',
  output: [
    {
      file: 'dist/vue-headroom.js',
      format: 'umd',
    },
    {
      file: 'dist/vue-headroom.common.js',
      format: 'cjs',
    },
    {
      file: 'docs/vue-headroom.js',
      format: 'umd',
    }
  ],
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
    })
  ],
  banner: `/*!
* vue-headroom v${pkg.version}
* ${pkg.repository.url}
*
* Copyright (c) ${now.getFullYear()} dalphyx
* Released under the ${pkg.license} license
*
* Date: ${now.toISOString()}
*/
  `
}
