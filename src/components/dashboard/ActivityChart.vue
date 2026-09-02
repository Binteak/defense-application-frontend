<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'

import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler
} from 'chart.js'

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler
)
 
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const canvas = ref(null)

let chart = null

function createChart() {

  if (!canvas.value || !props.data.length) {
    return
  }

  if (chart) {
    chart.destroy()
  }

  chart = new Chart(canvas.value, {
    type: 'line',

    data: {
      labels: props.data.map(item => item.time),

      datasets: [
        {
          data: props.data.map(item => item.value),

          borderWidth: 2,

          tension: 0.4,

          fill: true,

          pointRadius: 3,

          pointHoverRadius: 5,

          borderColor: '#7cff6b',

          backgroundColor: 'rgba(124, 255, 107, 0.08)',

          pointBackgroundColor: '#7cff6b',

          pointBorderWidth: 0
        }
      ]
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      interaction: {
        intersect: false,

        mode: 'index'
      },

      plugins: {

        legend: {
          display: false
        },

        tooltip: {
          displayColors: false,

          callbacks: {
            label: context => ` Activity: ${context.parsed.y}`
          }
        }
      },

      scales: {

        x: {
          grid: {
            display: false
          },

          ticks: {
            color: '#52525b',

            font: {
              size: 9
            }
          },

          border: {
            display: false
          }
        },

        y: {
          beginAtZero: true,

          grid: {
            color: 'rgba(255,255,255,0.05)'
          },

          ticks: {
            color: '#52525b',

            font: {
              size: 9
            }
          },

          border: {
            display: false
          }
        }
      }
    }
  })
}

watch(
  () => props.data,
  () => {
    createChart()
  },
  {
    immediate: true,
    deep: true
  }
)

onBeforeUnmount(() => {

  if (chart) {
    chart.destroy()
  }

})
</script>

<template>

  <div class="activity-chart">

    <canvas ref="canvas"></canvas>

  </div>

</template>

<style scoped>

.activity-chart {

  position: relative;

  width: 100%;

  height: 260px;

  padding: 20px;

  box-sizing: border-box;

}

</style>