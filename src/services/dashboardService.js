//Para la demo deploy
// import dashboardData from '../mocks/dashboard.json'

// export async function getDashboardData() {
//   // Simulamos una llamada al backend sin el HTTP, ya que no tenemos un backend real. En un caso real, aquí haríamos una llamada a la API para obtener los datos del dashboard.
//   await new Promise(resolve => setTimeout(resolve, 300))

//   return dashboardData
// }

//It works!
// const API_URL = 'http://127.0.0.1:8003/api'
const API_URL = 'https://defense-application-backend.onrender.com/api'


export async function getDashboardData() {
  const response = await fetch(`${API_URL}/dashboard/`)

  if (!response.ok) {
    throw new Error('Error loading dashboard data')
  }

  return await response.json()
}