<script setup>

import {
  ref,
  watch,
  onBeforeUnmount,
  nextTick
} from 'vue'


import {

  Chart,

  LineController,

  LineElement,

  PointElement,

  LinearScale,

  CategoryScale,

  Tooltip,

  Legend

} from 'chart.js'


// =========================================================
// REGISTER
// =========================================================

Chart.register(

  LineController,

  LineElement,

  PointElement,

  LinearScale,

  CategoryScale,

  Tooltip,

  Legend

)


// =========================================================
// PROPS
// =========================================================

const props = defineProps({

  data: {

    type: Array,

    default: () => []

  }

})


// =========================================================
// STATE
// =========================================================

const canvas =
  ref(null)

let chart =
  null


// =========================================================
// ASSETS
// =========================================================

const assets = [

  {
    id: 1,
    name: 'Sector North',
    color: '#7cff6b'
  },

  {
    id: 2,
    name: 'Sector East',
    color: '#facc15'
  },

  {
    id: 3,
    name: 'Sector South',
    color: '#c084fc'
  },

  {
    id: 4,
    name: 'Sector West',
    color: '#ff5c5c'
  }

]


// =========================================================
// DATASETS
// =========================================================

function createDatasets() {

  return assets.map(
    asset => {

      return {

        label:
          asset.name,

        assetId:
          asset.id,

        data:
          props.data.map(
            point => {

              const assetData =
                point.assets?.find(

                  item =>
                    item.id ===
                    asset.id

                )


              return (
                assetData?.value ?? 0
              )

            }
          ),

        borderWidth: 2,

        tension: 0.35,

        fill: false,

        borderColor:
          asset.color,

        pointBackgroundColor:
          asset.color,

        pointBorderColor:
          '#101419',

        pointBorderWidth: 2,

        pointRadius: 3,

        pointHoverRadius: 6

      }

    }
  )

}


// =========================================================
// CREATE CHART
// =========================================================

function createChart() {

  if (

    !canvas.value ||

    !props.data.length

  ) {

    return

  }


  // -------------------------------------------------------
  // Destroy previous chart
  // -------------------------------------------------------

  if (chart) {

    chart.destroy()

    chart = null

  }


  // -------------------------------------------------------
  // Create chart
  // -------------------------------------------------------

  chart = new Chart(

    canvas.value,

    {

      type: 'line',


      data: {

        labels:
          props.data.map(
            point =>
              point.time
          ),

        datasets:
          createDatasets()

      },


      options: {

        responsive: true,

        maintainAspectRatio:
          false,


        interaction: {

          intersect: false,

          mode: 'index'

        },


        plugins: {


          // =================================================
          // LEGEND
          // =================================================

          legend: {

            display: true,

            position: 'top',

            align: 'start',

            labels: {

              color: '#71717a',

              boxWidth: 8,

              boxHeight: 8,

              padding: 18,

              usePointStyle: true,

              pointStyle: 'circle',

              font: {

                size: 9,

                weight: '600'

              }

            }

          },


          // =================================================
          // TOOLTIP
          // =================================================

          tooltip: {

            displayColors: false,

            padding: 12,

            backgroundColor:
              '#101419',

            borderColor:
              'rgba(124,255,107,0.25)',

            borderWidth: 1,

            titleColor:
              '#7cff6b',

            bodyColor:
              '#a1a1aa',


            callbacks: {


              title:
                (contexts) => {

                  const index =
                    contexts[0].dataIndex

                  const point =
                    props.data[index]

                  return point
                    ? `${point.time} UTC`
                    : ''

                },


              label:
                (context) => {

                  const index =
                    context.dataIndex

                  const point =
                    props.data[index]


                  const asset =
                    point?.assets?.find(

                      item =>
                        item.id ===
                        context.dataset.assetId

                    )


                  if (!asset) {

                    return ''

                  }


                  return [

                    ` ${asset.name}`,

                    ` Activity: ${asset.value}`,

                    ` Event: ${asset.event}`,

                    ` Status: ${asset.status}`,

                    ` LAT: ${asset.lat}`,

                    ` LNG: ${asset.lng}`

                  ]

                }

            }

          }

        },


        // ===================================================
        // SCALES
        // ===================================================

        scales: {

          x: {

            grid: {

              display: false

            },

            ticks: {

              color: '#52525b',

              font: {

                size: 9

              },

              maxRotation: 0,

              autoSkip: true,

              maxTicksLimit: 8

            },

            border: {

              display: false

            }

          },


          y: {

            beginAtZero: true,

            max: 100,

            grid: {

              color:
                'rgba(255,255,255,0.05)'

            },

            ticks: {

              color: '#52525b',

              font: {

                size: 9

              },

              stepSize: 20

            },

            border: {

              display: false

            }

          }

        }

      }

    }

  )

}


// =========================================================
// WATCH
// =========================================================

watch(

  () => props.data,

  async () => {

    await nextTick()

    createChart()

  },

  {

    immediate: true,

    deep: true

  }

)


// =========================================================
// CLEANUP
// =========================================================

onBeforeUnmount(() => {

  if (chart) {

    chart.destroy()

    chart = null

  }

})

</script>


<template>

  <div class="activity-chart">

    <canvas
      ref="canvas"
    ></canvas>

  </div>

</template>


<style scoped>

.activity-chart {

  position: relative;

  width: 100%;

  height: 280px;

  padding:
    18px 20px 20px;

  box-sizing: border-box;

}

</style>