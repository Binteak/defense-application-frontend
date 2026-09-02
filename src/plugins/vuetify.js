import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'dark',

    themes: {
      dark: {
        dark: true,

        colors: {
          primary: '#7CFF6B',
          secondary: '#67E8F9',
          background: '#070A0D',
          surface: '#0D1218',
          'surface-variant': '#151C24',
          error: '#FF5C5C',
          warning: '#F5C542',
          success: '#7CFF6B'
        }
      }
    }
  },

  defaults: {
    VCard: {
      rounded: 'lg'
    },

    VBtn: {
      rounded: 'lg'
    }
  }
})

//Damos el aspecto dark tactical a la app, con colores verdes y azules, y un fondo oscuro. Los botones y tarjetas tienen esquinas redondeadas.