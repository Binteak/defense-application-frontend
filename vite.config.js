import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),

    ...(mode !== 'test'
      ? [
          vuetify({
            autoImport: true
          })
        ]
      : []),

    tailwindcss()
  ],

  test: {
    environment: 'jsdom',

    coverage: {
      provider: 'v8',
      reporter: ['text', 'html']
    }
  }
}))