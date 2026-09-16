<script setup>

import {
  ref,
  onMounted,
  onBeforeUnmount
} from 'vue'


import KpiCard
  from '../components/dashboard/KpiCard.vue'


import ActivityChart
  from '../components/dashboard/ActivityChart.vue'


import OperationalMap
  from '../components/dashboard/OperationalMap.vue'


import {
  getDashboardData
} from '../services/dashboardService'


// =========================================================
// STATE
// =========================================================

const kpis =
  ref([])


const activity =
  ref([])


const locations =
  ref([])


const threats =
  ref({

    low: 0,

    medium: 0,

    high: 0

  })


const lastSync =
  ref('')


const loading =
  ref(true)


const error = ref(null)


let updateInterval =
null



//Cargar Dashboard
const loadDashboard =
  async () => {

    try {

      const data =
        await getDashboardData() // LLamamos al servicio de Dashboard

      kpis.value =
        data.kpis

      locations.value =
        data.locations

      threats.value =
        data.threats

      lastSync.value =
        data.lastSync

      activity.value.push(
        data.activity
      )


      // Limitar el tamaño del array de actividad a 12 elementos
      if (
        activity.value.length > 12
      ) {

        activity.value.shift() // Eliminar el primer elemento

      }

      // Limpiar cualquier error previo
      error.value =
        null

    }

    catch (err) { // Manejamos los errores de la solicitud

      console.error(
        'Error loading dashboard:',
        err
      )


      error.value =
        'Unable to load dashboard data'

    }

    finally { // Siempre se ejecuta, independientemente de si hubo un error o no

      loading.value =
        false

    }

  }

onMounted(async () => {

  //Cargamos el dashboard al montar el componente
  await loadDashboard()

  // Configuramos un intervalo para actualizar el dashboard cada 5 segundos
  updateInterval =
    setInterval(

      loadDashboard,

      5000

    )

})


onBeforeUnmount(() => {

  if (updateInterval) {

    clearInterval(
      updateInterval
    )

    updateInterval =
      null

  }

})

</script>


<template>

  <div class="dashboard">


    <!-- ===================================================
         HEADER
         =================================================== -->

    <section class="dashboard-header">

      <div>

        <div class="eyebrow">

          OPERATIONAL OVERVIEW

        </div>


        <h1>

          Command Center

        </h1>


        <p>

          Real-time operational intelligence
          and situational awareness.

        </p>

      </div>


      <div class="sync">

        <div class="sync-label">

          LAST SYNCHRONIZATION

        </div>


        <div class="sync-value">

          <span class="sync-dot"></span>

          {{ lastSync || '--:--:--' }} UTC

        </div>

      </div>

    </section>


    <!-- ===================================================
         ERROR
         =================================================== -->

    <div
      v-if="error"
      class="dashboard-error"
    >

      <v-icon
        icon="mdi-alert-circle-outline"
        size="16"
      />

      {{ error }}

    </div>


    <!-- ===================================================
         KPI
         =================================================== -->

    <section class="kpi-grid">
      <KpiCard
        v-for="kpi in kpis"
        :key="kpi.label"
        v-bind="kpi"
      />

    </section>


    <!-- ===================================================
         MAIN GRID
         =================================================== -->

    <section class="dashboard-grid">


      <!-- =================================================
           ACTIVITY
           ================================================= -->

      <div class="panel activity-panel">

        <div class="panel-header">

          <div>

            <div class="panel-label">

              OPERATIONAL ACTIVITY

            </div>


            <div class="panel-title">

              Live asset activity

            </div>

          </div>


          <button class="panel-action">

            LIVE

            <span class="live-dot"></span>

          </button>

        </div>


        <ActivityChart
          :data="activity"
        />

      </div>


      <!-- =================================================
           THREATS
           ================================================= -->

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

              <span>
                LOW
              </span>


              <div class="bar">

                <div
                  class="bar-fill"
                  :style="{
                    width: `${threats.low}%`
                  }"
                ></div>

              </div>


              <strong>

                {{ threats.low }}%

              </strong>

            </div>


            <div class="threat-row">

              <span>
                MEDIUM
              </span>


              <div class="bar">

                <div
                  class="bar-fill"
                  :style="{
                    width: `${threats.medium}%`
                  }"
                ></div>

              </div>


              <strong>

                {{ threats.medium }}%

              </strong>

            </div>


            <div class="threat-row">

              <span>
                HIGH
              </span>


              <div class="bar">

                <div
                  class="bar-fill"
                  :style="{
                    width: `${threats.high}%`
                  }"
                ></div>

              </div>


              <strong>

                {{ threats.high }}%

              </strong>

            </div>


          </div>

        </div>

      </div>

    </section>


    <!-- ===================================================
         MAP
         =================================================== -->

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

          LIVE DATA

          <span class="live-dot"></span>

        </button>

      </div>

      <!--Y le pasamos la variable locations a ESTA vista-->
      <OperationalMap
        :locations="locations" 
      />

    </section>


  </div>

</template>


<style scoped>

.dashboard {

  max-width: 1600px;

  margin: 0 auto;

  padding:
    34px 38px 50px;

}


.eyebrow,
.panel-label,
.sync-label {

  color: #52525b;

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 0.18em;

}


.dashboard-header {

  display: flex;

  align-items: flex-end;

  justify-content: space-between;

  margin-bottom: 30px;

}


.dashboard-header h1 {

  margin:
    7px 0 5px;

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

  box-shadow:
    0 0 8px
    rgba(
      124,
      255,
      107,
      0.5
    );

}


.dashboard-error {

  display: flex;

  align-items: center;

  gap: 8px;

  margin-bottom: 14px;

  padding: 10px 14px;

  border:
    1px solid
    rgba(
      255,
      92,
      92,
      0.2
    );

  border-radius: 7px;

  background:
    rgba(
      255,
      92,
      92,
      0.04
    );

  color: #ff5c5c;

  font-size: 10px;

}


.kpi-grid {

  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 12px;

  margin-bottom: 14px;

}


.panel {

  overflow: hidden;

  border:
    1px solid
    rgba(
      255,
      255,
      255,
      0.055
    );

  border-radius: 10px;

  background:
    rgba(
      255,
      255,
      255,
      0.015
    );

}


.panel-header {

  display: flex;

  align-items: center;

  justify-content: space-between;

  padding:
    19px 20px;

  border-bottom:
    1px solid
    rgba(
      255,
      255,
      255,
      0.045
    );

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

  gap: 6px;

  padding: 6px 9px;

  border:
    1px solid
    rgba(
      255,
      255,
      255,
      0.06
    );

  border-radius: 6px;

  background: transparent;

  color: #52525b;

  font-size: 8px;

  font-weight: 700;

  letter-spacing: 0.08em;

}


.live-dot {

  width: 5px;

  height: 5px;

  border-radius: 50%;

  background: #7cff6b;

  box-shadow:
    0 0 7px
    rgba(
      124,
      255,
      107,
      0.7
    );

}


.panel-icon {

  color: #7cff6b;

}


.dashboard-grid {

  display: grid;

  grid-template-columns:
    1.7fr 1fr;

  gap: 14px;

  margin-bottom: 14px;

}


.threat-content {

  padding:
    35px 20px;

}


.threat-bars {

  display: flex;

  flex-direction: column;

  gap: 25px;

}


.threat-row {

  display: grid;

  grid-template-columns:
    55px 1fr 35px;

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

  background:
    rgba(
      255,
      255,
      255,
      0.05
    );

}


.bar-fill {

  height: 100%;

  border-radius: 4px;

  background: #7cff6b;

  box-shadow:
    0 0 8px
    rgba(
      124,
      255,
      107,
      0.25
    );

  transition:
    width 0.5s ease;

}


@media (max-width: 1100px) {

  .kpi-grid {

    grid-template-columns:
      repeat(2, 1fr);

  }


  .dashboard-grid {

    grid-template-columns: 1fr;

  }

}


@media (max-width: 650px) {

  .dashboard {

    padding:
      24px 16px 40px;

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