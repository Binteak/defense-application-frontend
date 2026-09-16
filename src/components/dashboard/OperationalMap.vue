<script setup>

import {
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick
} from 'vue'

import L from 'leaflet'

import 'leaflet/dist/leaflet.css'


// =========================================================
// PROPS
// =========================================================

const props = defineProps({

  locations: {

    type: Array,

    default: () => []

  }

})


let map = null

const markers = new Map()

let mapInitialized = false


// =========================================================
// ASSET COLOR
// =========================================================

const getAssetColor = (id) => {

  switch (id) {

    case 1:
      return '#7cff6b'

    case 2:
      return '#facc15'

    case 3:
      return '#c084fc'

    case 4:
      return '#ff5c5c'

    default:
      return '#a1a1aa'

  }

}


// =========================================================
// CREATE MARKER
// =========================================================

const createMarker = (location) => {

  const color =
    getAssetColor(location.id)


  return L.divIcon({

    className: 'aegis-marker',

    html: `

      <div class="marker-wrapper">

        <div
          class="marker-dot"
          style="
            background: ${color};
            box-shadow:
              0 0 10px ${color},
              0 0 18px ${color}66;
          "
        ></div>

      </div>

    `,

    iconSize: [18, 18],

    iconAnchor: [9, 9]

  })

}


// =========================================================
// PULSE
// =========================================================

const pulseMarker = (
  marker,
  color
) => {

  const element =
    marker.getElement()

  if (!element) return


  const wrapper =
    element.querySelector(
      '.marker-wrapper'
    )

  if (!wrapper) return


  const existingPulse =
    wrapper.querySelector(
      '.marker-pulse'
    )

  if (existingPulse) {

    existingPulse.remove()

  }


  const pulse =
    document.createElement('div')

  pulse.className =
    'marker-pulse'

  pulse.style.borderColor =
    color

  wrapper.appendChild(pulse)


  setTimeout(() => {

    if (pulse.parentNode) {

      pulse.remove()

    }

  }, 1000)

}


// =========================================================
// CREATE POPUP
// =========================================================

const createPopup = (location) => {

  const color =
    getAssetColor(location.id)


  return `

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
            background: ${color};
            box-shadow:
              0 0 6px ${color};
          "
        ></span>

        ${location.status}

      </div>

      <div class="popup-coordinates">

        LAT ${location.lat}

        ·

        LNG ${location.lng}

      </div>

    </div>

  `

}


// =========================================================
// UPDATE MARKERS
// =========================================================

const updateMarkers = (locations) => {

  if (!map) return

  if (!locations.length) return


  locations.forEach((location) => {


    // =====================================================
    // EXISTING MARKER
    // =====================================================

    if (markers.has(location.id)) {

      const marker =
        markers.get(location.id)


      // ---------------------------------------------------
      // MOVE
      // ---------------------------------------------------

      marker.setLatLng([

        Number(location.lat),

        Number(location.lng)

      ])


      // ---------------------------------------------------
      // UPDATE ICON
      // ---------------------------------------------------

      marker.setIcon(
        createMarker(location)
      )


      // ---------------------------------------------------
      // PULSE
      // ---------------------------------------------------

      pulseMarker(

        marker,

        getAssetColor(
          location.id
        )

      )


      // ---------------------------------------------------
      // UPDATE POPUP
      // ---------------------------------------------------

      marker.setPopupContent(
        createPopup(location)
      )

    }


    // =====================================================
    // NEW MARKER
    // =====================================================

    else {

      const marker =
        L.marker(

          [

            Number(location.lat),

            Number(location.lng)

          ],

          {

            icon:
              createMarker(location)

          }

        )


      marker
        .addTo(map)

        .bindPopup(
          createPopup(location)
        )


      markers.set(

        location.id,

        marker

      )

    }

  })

}


// =========================================================
// CENTER MAP ON LOCATIONS
// =========================================================

const fitMapToLocations = (locations) => {

  if (!map) return

  if (!locations.length) return


  const validLocations = locations.filter(

    location =>

      location.lat !== undefined &&

      location.lng !== undefined &&

      !isNaN(Number(location.lat)) &&

      !isNaN(Number(location.lng))

  )


  if (!validLocations.length) return


  const bounds = L.latLngBounds(

    validLocations.map(location => [

      Number(location.lat),

      Number(location.lng)

    ])

  )


  map.fitBounds(bounds, {

    padding: [100, 100],

    maxZoom: 15,

    animate: false

  })

}


// =========================================================
// INITIALIZE MAP
// =========================================================

const initializeMap = async () => {

  if (mapInitialized) return


  await nextTick()


  const mapElement =
    document.getElementById(
      'operational-map'
    )


  if (!mapElement) {

    console.error(
      'Operational map element not found'
    )

    return

  }


  // =======================================================
  // CREATE MAP
  // =======================================================

  map = L.map(

    mapElement,

    {

      zoomControl: false,

      attributionControl: false

    }

  )


  // =======================================================
  // DEFAULT VIEW
  // =======================================================

  map.setView(

    [40.4168, -3.7038],

    10

  )


  // =======================================================
  // ZOOM CONTROL
  // =======================================================

  L.control

    .zoom({

      position:
        'bottomright'

    })

    .addTo(map)


  // =======================================================
  // CARTO DARK MAP
  // =======================================================

  L.tileLayer(

    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png?key=cb1_2peb_1_dd814281bcddf6484a83d499',

    {

      attribution:
        '&copy; OpenStreetMap &copy; CARTO',

      subdomains:
        'abcd',

      maxZoom: 20

    }

  ).addTo(map)


  mapInitialized = true


  // =======================================================
  // INVALIDATE SIZE
  // =======================================================

  setTimeout(() => {

    if (map) {

      map.invalidateSize()

    }

  }, 100)


  // =======================================================
  // INITIAL LOCATIONS
  // =======================================================

  if (
    props.locations.length
  ) {

    updateMarkers(
      props.locations
    )

    fitMapToLocations(
      props.locations
    )

  }

}


// =========================================================
// WATCH LOCATIONS
// =========================================================

watch(

  () => props.locations,

  async (locations) => {


    // -----------------------------------------------------
    // If map does not exist yet, wait for it
    // -----------------------------------------------------

    if (!mapInitialized) {

      await initializeMap()

      return

    }


    // -----------------------------------------------------
    // UPDATE MARKERS + MAP VIEW
    // -----------------------------------------------------

    if (locations.length) {

      updateMarkers(
        locations
      )

      // IMPORTANT:
      // Recalculate the map every time
      // the backend sends new coordinates.

      fitMapToLocations(
        locations
      )

    }

  },

  {

    deep: true

  }

)


// =========================================================
// MOUNT
// =========================================================

onMounted(async () => {

  await initializeMap()

})


// =========================================================
// UNMOUNT
// =========================================================

onBeforeUnmount(() => {


  // Remove markers from the map

  markers.forEach(marker => {

    if (map) {

      map.removeLayer(marker)

    }

  })


  // Clear marker collection

  markers.clear()


  // Destroy Leaflet map

  if (map) {

    map.remove()

    map = null

  }


  mapInitialized = false

})

</script>


<template>

  <div class="map-wrapper">

    <div
      id="operational-map"
      class="operational-map"
    ></div>


    <div class="map-overlay">


      <!-- ================================================= -->
      <!-- LIVE -->
      <!-- ================================================= -->

      <div class="live-indicator">

        <span></span>

        LIVE DATA

      </div>


      <!-- ================================================= -->
      <!-- COORDINATES -->
      <!-- ================================================= -->

      <div class="coordinates">

        LAT 40.4168 · LNG -3.7038

      </div>


      <!-- ================================================= -->
      <!-- LEGEND -->
      <!-- ================================================= -->

      <div class="map-legend">

        <div class="legend-title">

          ASSETS

        </div>


        <div class="legend-item">

          <span
            class="legend-dot north"
          ></span>

          SECTOR NORTH

        </div>


        <div class="legend-item">

          <span
            class="legend-dot east"
          ></span>

          SECTOR EAST

        </div>


        <div class="legend-item">

          <span
            class="legend-dot south"
          ></span>

          SECTOR SOUTH

        </div>


        <div class="legend-item">

          <span
            class="legend-dot west"
          ></span>

          SECTOR WEST

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

  min-height: 360px;

  background: #080c10;

}


/* =========================================================
   MARKERS
   ========================================================= */

:deep(.aegis-marker) {

  background: transparent;

  border: none;

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

  border:
    2px solid rgba(
      255,
      255,
      255,
      0.35
    );

  border-radius: 50%;

}


/* =========================================================
   PULSE
   ========================================================= */

:deep(.marker-pulse) {

  position: absolute;

  top: 50%;

  left: 50%;

  width: 9px;

  height: 9px;

  border: 1px solid;

  border-radius: 50%;

  transform:
    translate(
      -50%,
      -50%
    );

  animation:
    markerPulse 1s ease-out forwards;

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


/* =========================================================
   OVERLAY
   ========================================================= */

.map-overlay {

  position: absolute;

  z-index: 500;

  inset: 0;

  pointer-events: none;

}


/* =========================================================
   LIVE
   ========================================================= */

.live-indicator {

  position: absolute;

  top: 16px;

  left: 18px;

  display: flex;

  align-items: center;

  gap: 7px;

  padding: 7px 9px;

  border:
    1px solid
    rgba(
      124,
      255,
      107,
      0.12
    );

  border-radius: 6px;

  background:
    rgba(
      7,
      10,
      13,
      0.85
    );

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

  box-shadow:
    0 0 8px
    rgba(
      124,
      255,
      107,
      0.7
    );

}


/* =========================================================
   COORDINATES
   ========================================================= */

.coordinates {

  position: absolute;

  right: 18px;

  bottom: 16px;

  padding: 6px 8px;

  border-radius: 5px;

  background:
    rgba(
      7,
      10,
      13,
      0.85
    );

  color: #71717a;

  font-family: monospace;

  font-size: 8px;

}


/* =========================================================
   LEGEND
   ========================================================= */

.map-legend {

  position: absolute;

  left: 18px;

  bottom: 18px;

  display: flex;

  flex-direction: column;

  gap: 8px;

  padding: 11px 13px;

  border:
    1px solid
    rgba(
      255,
      255,
      255,
      0.07
    );

  border-radius: 7px;

  background:
    rgba(
      7,
      10,
      13,
      0.88
    );

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


.legend-dot.north {

  background: #7cff6b;

}


.legend-dot.east {

  background: #facc15;

}


.legend-dot.south {

  background: #c084fc;

}


.legend-dot.west {

  background: #ff5c5c;

}


/* =========================================================
   LEAFLET
   ========================================================= */

:deep(.leaflet-control-zoom) {

  border:
    1px solid
    rgba(
      255,
      255,
      255,
      0.08
    )
    !important;

}


:deep(.leaflet-control-zoom a) {

  background:
    #101419 !important;

  color:
    #71717a !important;

  border-bottom-color:
    rgba(
      255,
      255,
      255,
      0.08
    )
    !important;

}


:deep(.leaflet-control-zoom a:hover) {

  background:
    #171c22 !important;

  color:
    #7cff6b !important;

}


/* =========================================================
   POPUP
   ========================================================= */

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

  color: #a1a1aa;

  font-size: 8px;

  font-weight: 700;

}


:deep(.popup-status span) {

  width: 5px;

  height: 5px;

  border-radius: 50%;

}


:deep(.popup-coordinates) {

  margin-top: 7px;

  color: #52525b;

  font-family: monospace;

  font-size: 8px;

}

</style>