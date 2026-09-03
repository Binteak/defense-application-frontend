<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'


let map = null
let updateInterval = null

const markers = new Map()

// const locations = [
//   {
//     name: 'Sector North',
//     lat: 40.4268,
//     lng: -3.7038,
//     status: 'OPERATIONAL'
//   },
//   {
//     name: 'Sector East',
//     lat: 40.4200,
//     lng: -3.6800,
//     status: 'WARNING'
//   },
//   {
//     name: 'Sector South',
//     lat: 40.4050,
//     lng: -3.7100,
//     status: 'OPERATIONAL'
//   },
//   {
//     name: 'Sector West',
//     lat: 40.4150,
//     lng: -3.7300,
//     status: 'CRITICAL'
//   }
// ]

const getStatusColor = (status) => {
  switch (status) {
    case 'OPERATIONAL':
      return '#7cff6b'

    case 'WARNING':
      return '#facc15'

    case 'CRITICAL':
      return '#ff5c5c'

    default:
      return '#a1a1aa'
  }
}

const createMarker = (location) => {
  const color = getStatusColor(location.status)

  return L.divIcon({
    className: 'aegis-marker',

    html: `
      <div class="marker-wrapper">
        <div
          class="marker-dot"
          style="
            background:${color};
            box-shadow:0 0 14px ${color};
          "
        ></div>
      </div>
    `,

    iconSize: [18, 18],

    iconAnchor: [9, 9]
  })
}

const pulseMarker = (marker, color) => {
  const element = marker.getElement()

  if (!element) return

  const wrapper = element.querySelector('.marker-wrapper')

  if (!wrapper) return

  // Evitar acumular pulsos
  const existingPulse = wrapper.querySelector('.marker-pulse')

  if (existingPulse) {
    existingPulse.remove()
  }

  const pulse = document.createElement('div')

  pulse.className = 'marker-pulse'

  pulse.style.borderColor = color

  wrapper.appendChild(pulse)

  setTimeout(() => {
    pulse.remove()
  }, 1000)
}

const loadLocations = async () => {
  try {
    const response = await fetch(
      'http://127.0.0.1:8003/api/locations/'
    )

    if (!response.ok) {
      throw new Error('Error loading locations')
    }

    const locations = await response.json()

    locations.forEach((location) => {

    //   if (markers.has(location.id)) {

    //     // El marker ya existe → moverlo
    //     const marker = markers.get(location.id)

    //     marker.setLatLng([
    //       location.lat,
    //       location.lng
    //     ])

    if (markers.has(location.id)) {

        const marker = markers.get(location.id)

        marker.setLatLng([
            location.lat,
            location.lng
        ])

        // Efecto de actualización
        pulseMarker(
            marker,
            getStatusColor(location.status)
        )



      } else {

        // Primera vez → crear marker
        const marker = L.marker(
          [location.lat, location.lng],
          {
            icon: createMarker(location)
          }
        )

        marker
          .addTo(map)
          .bindPopup(`
            <div class="popup-content">

              <div class="popup-label">
                AEGIS ASSET
              </div>

              <div class="popup-name">
                ${location.name}
              </div>

              <div class="popup-status">
                <span
                  style="
                    background:${getStatusColor(location.status)};
                  "
                ></span>

                ${location.status}
              </div>

            </div>
          `)

        markers.set(location.id, marker)
      }
    })

  } catch (error) {
    console.error('Error loading locations:', error)
  }
}

// onMounted(() => {
//   map = L.map('operational-map', {
//     zoomControl: false,
//     attributionControl: false
//   }).setView(
//     [40.4168, -3.7038],
//     12
//   )

//   L.control
//     .zoom({
//       position: 'bottomright'
//     })
//     .addTo(map)

// //   L.tileLayer(
// //     'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
// //     {
// //       maxZoom: 19
// //     }
// //   ).addTo(map)

//   L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png?key=cb1_2peb_1_dd814281bcddf6484a83d499', {
//   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
//   subdomains: 'abcd', maxZoom: 20
// }).addTo(map);


// await loadLocations()

// updateInterval = setInterval(
//   loadLocations,
//   30000
// )

//   locations.forEach((location) => {
//     const marker = L.marker(
//       [location.lat, location.lng],
//       {
//         icon: createMarker(location)
//       }
//     )

//     marker
//       .addTo(map)
//       .bindPopup(`
//         <div class="popup-content">

//           <div class="popup-label">
//             AEGIS ASSET
//           </div>

//           <div class="popup-name">
//             ${location.name}
//           </div>

//           <div class="popup-status">
//             <span
//               style="
//                 background:${getStatusColor(location.status)};
//               "
//             ></span>

//             ${location.status}
//           </div>

//         </div>
//       `)
//   })
// })


onMounted(async () => {

  map = L.map('operational-map', {
    zoomControl: false,
    attributionControl: false
  }).setView(
    [40.4168, -3.7038],
    12
  )

  L.control
    .zoom({
      position: 'bottomright'
    })
    .addTo(map)

  L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png?key=cb1_2peb_1_dd814281bcddf6484a83d499',
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }
  ).addTo(map)

  // Primera carga
  await loadLocations()

  // Actualizar cada 30 segundos
  updateInterval = setInterval(
    loadLocations,
    5000
  )
})

onBeforeUnmount(() => {

  if (updateInterval) {
    clearInterval(updateInterval)
    updateInterval = null
  }

  if (map) {
    map.remove()
    map = null
  }
})
</script>

<template>
  <div class="map-wrapper">

    <div
      id="operational-map"
      class="operational-map"
    ></div>

    <div class="map-overlay">

      <div class="live-indicator">
        <span></span>
        LIVE DATA
      </div>

      <div class="coordinates">
        LAT 40.4168 · LNG -3.7038
      </div>

      <div class="map-legend">

        <div class="legend-title">
          STATUS
        </div>

        <div class="legend-item">
          <span class="legend-dot operational"></span>
          OPERATIONAL
        </div>

        <div class="legend-item">
          <span class="legend-dot warning"></span>
          WARNING
        </div>

        <div class="legend-item">
          <span class="legend-dot critical"></span>
          CRITICAL
        </div>

      </div>

    </div>

  </div>
</template>

<style scoped>
.map-wrapper {
  position: relative;

  width: 100%;
  height: 360px;

  overflow: hidden;
}

.operational-map {
  width: 100%;
  height: 100%;

  background: #080c10;
}


/* MARKERS */

:deep(.aegis-marker) {
  background: transparent;
  border: none;
}

:deep(.marker-wrapper) {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 18px;
  height: 18px;
}

:deep(.marker-dot) {
  width: 9px;
  height: 9px;

  border: 2px solid rgba(255, 255, 255, 0.35);

  border-radius: 50%;
}


/* OVERLAY */

.map-overlay {
  position: absolute;

  z-index: 500;

  inset: 0;

  pointer-events: none;
}

.live-indicator {
  position: absolute;

  top: 16px;
  left: 18px;

  display: flex;
  align-items: center;

  gap: 7px;

  padding: 7px 9px;

  border: 1px solid rgba(124, 255, 107, 0.12);

  border-radius: 6px;

  background: rgba(7, 10, 13, 0.85);

  color: #7cff6b;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.12em;
}

.live-indicator span {
  width: 5px;
  height: 5px;

  border-radius: 50%;

  background: #7cff6b;

  box-shadow: 0 0 8px rgba(124, 255, 107, 0.7);
}

.coordinates {
  position: absolute;

  right: 18px;
  bottom: 16px;

  padding: 6px 8px;

  border-radius: 5px;

  background: rgba(7, 10, 13, 0.85);

  color: #71717a;

  font-family: monospace;

  font-size: 8px;
}

.map-legend {
  position: absolute;

  left: 18px;
  bottom: 18px;

  display: flex;
  flex-direction: column;

  gap: 8px;

  padding: 11px 13px;

  border: 1px solid rgba(255, 255, 255, 0.07);

  border-radius: 7px;

  background: rgba(7, 10, 13, 0.88);
}

.legend-title {
  margin-bottom: 2px;

  color: #52525b;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.14em;
}

.legend-item {
  display: flex;
  align-items: center;

  gap: 7px;

  color: #71717a;

  font-size: 8px;
}

.legend-dot {
  width: 5px;
  height: 5px;

  border-radius: 50%;
}

.legend-dot.operational {
  background: #7cff6b;
}

.legend-dot.warning {
  background: #facc15;
}

.legend-dot.critical {
  background: #ff5c5c;
}


/* LEAFLET */

:deep(.leaflet-control-zoom) {
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}

:deep(.leaflet-control-zoom a) {
  background: #101419 !important;

  color: #71717a !important;

  border-bottom-color: rgba(255, 255, 255, 0.08) !important;
}

:deep(.leaflet-control-zoom a:hover) {
  background: #171c22 !important;

  color: #7cff6b !important;
}

:deep(.leaflet-popup-content-wrapper),
:deep(.leaflet-popup-tip) {
  background: #101419;

  color: #a1a1aa;
}

:deep(.leaflet-popup-content) {
  margin: 12px;
}

:deep(.popup-label) {
  color: #52525b;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.14em;
}

:deep(.popup-name) {
  margin-top: 4px;

  color: #f4f4f5;

  font-size: 12px;
  font-weight: 600;
}

:deep(.popup-status) {
  display: flex;
  align-items: center;

  gap: 6px;

  margin-top: 8px;

  color: #7cff6b;

  font-size: 8px;
  font-weight: 700;
}

:deep(.popup-status span) {
  width: 5px;
  height: 5px;

  border-radius: 50%;
}


:deep(.marker-wrapper) {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 18px;
  height: 18px;
}

:deep(.marker-dot) {
  position: relative;
  z-index: 2;

  width: 9px;
  height: 9px;

  border: 2px solid rgba(255, 255, 255, 0.35);

  border-radius: 50%;
}

:deep(.marker-pulse) {
  position: absolute;

  top: 50%;
  left: 50%;

  width: 9px;
  height: 9px;

  border: 1px solid;

  border-radius: 50%;

  transform: translate(-50%, -50%);

  animation: markerPulse 1s ease-out forwards;

  pointer-events: none;
}

@keyframes markerPulse {
  0% {
    width: 9px;
    height: 9px;

    opacity: 0.9;
  }

  70% {
    opacity: 0.35;
  }

  100% {
    width: 42px;
    height: 42px;

    opacity: 0;
  }
}
</style>