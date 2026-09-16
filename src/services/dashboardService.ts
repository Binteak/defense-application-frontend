//Para la demo deploy
// import dashboardData from '../mocks/dashboard.json'

// export async function getDashboardData() {
//   // Simulamos una llamada al backend sin el HTTP, ya que no tenemos un backend real. En un caso real, aquí haríamos una llamada a la API para obtener los datos del dashboard.
//   await new Promise(resolve => setTimeout(resolve, 300))

//   return dashboardData
// }

//It works!
// const API_URL = 'http://127.0.0.1:8003/api'





// import { environment } from '../environments/environment'

// interface DashboardData {
//   // aquí pondremos los campos de tu dashboard
// }

// export async function getDashboardData(): Promise<DashboardData> {
//   const response = await fetch(
//     `${environment.apiUrl}/dashboard/`
//   )

//   if (!response.ok) {
//     throw new Error('Error loading dashboard')
//   }

//   return await response.json()
// }




interface DashboardData {
  kpis: Array<{
    label?: string
    title?: string
    value: string | number
    [key: string]: unknown
  }>

  activity: unknown

  locations: Array<{
    id?: number
    name?: string
    status?: string
    lat?: number
    lng?: number
    direction?: number
    speed?: number
    [key: string]: unknown
  }>

  threats: {
    low?: number
    medium?: number
    high?: number
    [key: string]: unknown
  }

  lastSync: string
}

const API_URL = import.meta.env.VITE_API_URL

export async function getDashboardData(): Promise<DashboardData> {
  const response = await fetch(
    `${API_URL}/dashboard/`
  )

  if (!response.ok) {
    throw new Error('Error loading dashboard')
  }

  return await response.json()
}