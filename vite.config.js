import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  name: "vue-headroom",
  plugins: [
    vue({
      template: {
        compilerOptions: {
          compileTemplate: true
        }
      },
    }),
  ],
  build:{
    sourcemap:true,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.js'),
      name: 'vueHeadroom',
      // the proper extensions will be added
      fileName: 'vue-headroom',
      formats:['cjs', 'umd', 'es', 'iife']
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
      },
    }
  }
})
