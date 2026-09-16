import { describe, test, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DashboardView from '../../views/DashboardView.vue'

import KpiCard from '../../components/dashboard/KpiCard.vue'

import { getDashboardData } from '../../services/dashboardService'

vi.mock('../../services/dashboardService', () => ({
  getDashboardData: vi.fn() // Como el SpyObject. El vi.fn() se usa para crear una función mock que puede ser observada y controlada en las prubas
}))

describe('DashboardView', () => {


  // =====================================================
  // TEST 1
  // Comprueba que el servicio
  // devuelve los datos del dashboard
  // =====================================================

  test('should load dashboard data', async () => {

    const mockData = {
      kpis: [
        {
          label: 'SYSTEMS',
          value: 12
        }
      ],

      locations: [],

      threats: {
        low: 60,
        medium: 30,
        high: 10
      },

      lastSync: '19:30:00',

      activity: 50
    }

    vi.mocked(getDashboardData).mockResolvedValue(mockData) // Mockeamos la función getDashboardData para que devuelva los datos de prueba mockData cuando se llame en el test

    const wrapper = mount(DashboardView, { // Montamos el componente DashboardView para poder probarlo
      global: {
        stubs: { // Stub para los componentes hijos que se usan en DashboardView
          'v-icon': true,
          KpiCard: true,
          ActivityChart: true,
          OperationalMap: true
        }
      }
    })

    await new Promise(resolve => setTimeout(resolve, 0)) // Esperamoss a que termine onMounted() y se resuelva la promesa de getDashboardData

    expect(getDashboardData).toHaveBeenCalled()

    expect(wrapper.text()).toContain('19:30:00')

    const kpiCard = wrapper.findComponent(KpiCard) 

    expect(kpiCard.exists()).toBe(true) //Existe
  })

})

