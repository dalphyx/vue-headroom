const babel = require('rollup-plugin-babel')
const vue = require('rollup-plugin-vue')

module.exports = {
  input: {
    'vue-headroom': 'src/index.js'
  },
  output: {
    fileName: '[name]-[format][min].js',
    moduleName: 'vueHeadroom',
    format: ['cjs', 'umd', 'umd-min', 'es', 'iife']
  },
  plugins: {
    vue: {
      compileTemplate: true
    },
    babel: {
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [
        [
          "@babel/preset-env",
          {
            "modules": false,
            "loose": true,
            "targets": {
              "browsers": [
                "last 2 versions",
                "ie >= 9"
              ]
            }
          }
        ]
      ]      
    }
  },
  banner: {
    year: 2016
  }
}
