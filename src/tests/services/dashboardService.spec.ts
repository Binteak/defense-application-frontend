import { describe, test, expect, vi } from 'vitest'
import { getDashboardData } from '../../services/dashboardService'

describe('dashboardService', () => {

  test('should return dashboard data', async () => {

    const mockData = {
      systems: 10,
      alerts: 2
    }

    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockData)
        })
      )
    )

    const result = await getDashboardData()

    expect(result).toEqual(mockData)
  })

})
