import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KpiCard from '../../components/dashboard/KpiCard.vue'

describe('KpiCard', () => {

  test('should display the label and value', () => {

    const wrapper = mount(KpiCard, {
      props: {
        label: 'SYSTEMS',
        value: 12
      },

      global: {
        stubs: {
          'v-icon': true
        }
      }
    })

    expect(wrapper.text()).toContain('SYSTEMS')
    expect(wrapper.text()).toContain('12')
  })


  test('should display the description', () => {

    const wrapper = mount(KpiCard, {
      props: {
        label: 'SYSTEMS',
        value: 12,
        description: 'Active systems'
      },

      global: {
        stubs: {
          'v-icon': true
        }
      }
    })

    expect(wrapper.text()).toContain('Active systems')
  })


  test('should display the trend when it is provided', () => {

    const wrapper = mount(KpiCard, {
      props: {
        label: 'SYSTEMS',
        value: 12,
        trend: '+5%'
      },

      global: {
        stubs: {
          'v-icon': true
        }
      }
    })

    expect(wrapper.text()).toContain('+5%')
  })


  test('should not display the trend when it is not provided', () => {

    const wrapper = mount(KpiCard, {
      props: {
        label: 'SYSTEMS',
        value: 12 
      },

      global: {
        stubs: {
          'v-icon': true
        }
      }
    })

    expect(wrapper.find('.kpi-trend').exists()).toBe(false)
  })

})

