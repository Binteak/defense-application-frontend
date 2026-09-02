

<script setup>
import { ref, onMounted } from 'vue'

import KpiCard from '../components/dashboard/KpiCard.vue'
import ActivityChart from '../components/dashboard/ActivityChart.vue'
import OperationalMap from '../components/dashboard/OperationalMap.vue'

import { getDashboardData } from '../services/dashboardService'

const kpis = ref([])

const activity = ref([])

const threats = ref({
  low: 0,
  medium: 0,
  high: 0
})

const lastSync = ref('')

const loading = ref(true)

const error = ref(null)

onMounted(async () => {
  try {
    const data = await getDashboardData()

    kpis.value = data.kpis
    activity.value = data.activity
    threats.value = data.threats
    lastSync.value = data.lastSync

  } catch (err) {
    console.error('Error loading dashboard:', err)

    error.value = 'Unable to load dashboard data'

  } finally {
    loading.value = false
  }
})


//antes para construirlo teníamos por ejemplo:
// const lastSync = ref('18:06:42')

// const kpis = [
//   {
//     label: 'ACTIVE ASSETS',
//     value: '128',
//     description: 'Currently monitored',
//     icon: 'mdi-access-point',
//     trend: '+4.2%'
//   },
//   {
//     label: 'OPERATIONAL ZONES',
//     value: '24',
//     description: 'Across active sectors',
//     icon: 'mdi-map-marker-radius-outline',
//     trend: '+2'
//   },
//   {
//     label: 'ACTIVE ALERTS',
//     value: '07',
//     description: 'Requires attention',
//     icon: 'mdi-alert-outline',
//     trend: '−12%'
//   },
//   {
//     label: 'SYSTEM UPTIME',
//     value: '99.98%',
//     description: 'Last 30 days',
//     icon: 'mdi-server-outline',
//     trend: 'STABLE'
//   }
// ]
</script>

<template>
  <div class="dashboard">

    <!-- HEADER -->

    <section class="dashboard-header">

      <div>

        <div class="eyebrow">
          OPERATIONAL OVERVIEW
        </div>

        <h1>
          Command Center
        </h1>

        <p>
          Real-time operational intelligence and situational awareness.
        </p>

      </div>

      <div class="sync">

        <div class="sync-label">
          LAST SYNCHRONIZATION
        </div>

        <div class="sync-value">

          <span class="sync-dot"></span>

          {{ lastSync }} UTC

        </div>

      </div>

    </section>


    <!-- KPI GRID -->

    <section class="kpi-grid">

      <KpiCard
        v-for="kpi in kpis"
        :key="kpi.label"
        v-bind="kpi"
      />

    </section>


    <!-- MAIN GRID -->

    <section class="dashboard-grid">

      <!-- ACTIVITY -->

      <div class="panel activity-panel">

        <div class="panel-header">

          <div>

            <div class="panel-label">
              OPERATIONAL ACTIVITY
            </div>

            <div class="panel-title">
              Activity overview
            </div>

          </div>

          <button class="panel-action">
            LAST 24H
            <v-icon
              icon="mdi-chevron-down"
              size="14"
            />
          </button>

        </div>

        <!-- <div class="chart-placeholder">

          <div class="chart-lines"></div>

          <div class="chart-message">
            Chart.js visualization
          </div>

        </div> -->
        <ActivityChart :data="activity"/>

      </div>


      <!-- THREAT -->

      <div class="panel threat-panel">

        <div class="panel-header">

          <div>

            <div class="panel-label">
              THREAT CLASSIFICATION
            </div>

            <div class="panel-title">
              Current distribution
            </div>

          </div>

          <v-icon
            icon="mdi-radar"
            size="18"
            class="panel-icon"
          />

        </div>

        <div class="threat-content">

          <div class="threat-bars">

            <div class="threat-row">

              <span>LOW</span>

              <div class="bar">
                <div
                  class="bar-fill"
                  style="width: 82%"
                ></div>
              </div>

              <strong>82%</strong>

            </div>

            <div class="threat-row">

              <span>MEDIUM</span>

              <div class="bar">
                <div
                  class="bar-fill"
                  style="width: 48%"
                ></div>
              </div>

              <strong>48%</strong>

            </div>

            <div class="threat-row">

              <span>HIGH</span>

              <div class="bar">
                <div
                  class="bar-fill"
                  style="width: 21%"
                ></div>
              </div>

              <strong>21%</strong>

            </div>

          </div>

        </div>

      </div>

    </section>


    <!-- MAP -->

    <section class="panel map-panel">

      <div class="panel-header">

        <div>

          <div class="panel-label">
            SITUATIONAL AWARENESS
          </div>

          <div class="panel-title">
            Operational Map
          </div>

        </div>

        <button class="panel-action">
          OPEN FULL MAP
          <v-icon
            icon="mdi-arrow-top-right"
            size="14"
          />
        </button>

      </div>
<!-- 
      <div class="map-placeholder">

        <div class="map-overlay">

          <div class="map-status">
            <span></span>
            LIVE DATA
          </div>

          <div class="map-center">
            Leaflet map
          </div>

        </div>

      </div> -->
      <OperationalMap />

    </section>

  </div>
</template>

<style scoped>
.dashboard {
  max-width: 1600px;

  margin: 0 auto;

  padding: 34px 38px 50px;
}


/* HEADER */

.dashboard-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  margin-bottom: 30px;
}

.eyebrow,
.panel-label,
.sync-label {
  color: #52525b;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.18em;
}

.dashboard-header h1 {
  margin: 7px 0 5px;

  color: #f4f4f5;

  font-size: 29px;
  font-weight: 500;

  letter-spacing: -0.035em;
}

.dashboard-header p {
  color: #52525b;

  font-size: 11px;
}

.sync {
  text-align: right;
}

.sync-value {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  gap: 7px;

  margin-top: 6px;

  color: #71717a;

  font-family: monospace;
  font-size: 10px;
}

.sync-dot {
  width: 5px;
  height: 5px;

  border-radius: 50%;

  background: #7cff6b;

  box-shadow: 0 0 8px rgba(124, 255, 107, 0.5);
}


/* KPIS */

.kpi-grid {
  display: grid;

  grid-template-columns: repeat(4, 1fr);

  gap: 12px;

  margin-bottom: 14px;
}


/* PANELS */

.panel {
  overflow: hidden;

  border: 1px solid rgba(255, 255, 255, 0.055);
  border-radius: 10px;

  background: rgba(255, 255, 255, 0.015);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 19px 20px;

  border-bottom: 1px solid rgba(255, 255, 255, 0.045);
}

.panel-title {
  margin-top: 5px;

  color: #a1a1aa;

  font-size: 12px;
  font-weight: 600;
}

.panel-action {
  display: flex;
  align-items: center;
  gap: 5px;

  padding: 6px 9px;

  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;

  background: transparent;

  color: #52525b;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.08em;

  cursor: pointer;
}

.panel-action:hover {
  color: #a1a1aa;

  border-color: rgba(255, 255, 255, 0.12);
}

.panel-icon {
  color: #7cff6b;
}


/* MAIN GRID */

.dashboard-grid {
  display: grid;

  grid-template-columns: 1.7fr 1fr;

  gap: 14px;

  margin-bottom: 14px;
}


/* CHART */

.chart-placeholder {
  position: relative;

  height: 260px;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  background:
    linear-gradient(
      rgba(255, 255, 255, 0.018) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.018) 1px,
      transparent 1px
    );

  background-size: 45px 45px;
}

.chart-message {
  color: #27272a;

  font-size: 10px;

  letter-spacing: 0.12em;
  text-transform: uppercase;
}


/* THREAT */

.threat-content {
  padding: 35px 20px;
}

.threat-bars {
  display: flex;
  flex-direction: column;

  gap: 25px;
}

.threat-row {
  display: grid;

  grid-template-columns: 55px 1fr 35px;

  align-items: center;

  gap: 12px;

  color: #52525b;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.1em;
}

.threat-row strong {
  color: #71717a;

  text-align: right;

  font-size: 9px;
}

.bar {
  height: 4px;

  overflow: hidden;

  border-radius: 4px;

  background: rgba(255, 255, 255, 0.05);
}

.bar-fill {
  height: 100%;

  border-radius: 4px;

  background: #7cff6b;

  box-shadow: 0 0 8px rgba(124, 255, 107, 0.25);
}


/* MAP */

.map-placeholder {
  position: relative;

  height: 360px;

  background:
    radial-gradient(
      circle at 50% 50%,
      rgba(124, 255, 107, 0.035),
      transparent 30%
    ),
    #080c10;
}

.map-overlay {
  position: absolute;

  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;
}

.map-status {
  position: absolute;

  top: 16px;
  left: 18px;

  display: flex;
  align-items: center;
  gap: 7px;

  padding: 7px 9px;

  border: 1px solid rgba(124, 255, 107, 0.1);
  border-radius: 6px;

  background: rgba(7, 10, 13, 0.7);

  color: #7cff6b;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.12em;
}

.map-status span {
  width: 5px;
  height: 5px;

  border-radius: 50%;

  background: #7cff6b;
}

.map-center {
  color: #27272a;

  font-size: 10px;

  letter-spacing: 0.14em;
  text-transform: uppercase;
}


/* RESPONSIVE */

@media (max-width: 1100px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 650px) {
  .dashboard {
    padding: 24px 16px 40px;
  }

  .dashboard-header {
    align-items: flex-start;

    flex-direction: column;

    gap: 20px;
  }

  .sync {
    text-align: left;
  }

  .sync-value {
    justify-content: flex-start;
  }

  .kpi-grid {
    grid-template-columns: 1fr;
  }
}
</style>