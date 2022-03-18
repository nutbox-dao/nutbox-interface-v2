<template>
  <canvas :id="canvasId"></canvas>
</template>

<script>
import { Chart, LineController, Tooltip, CategoryScale, registerables } from 'chart.js'
Chart.register(
  LineController,
  Tooltip,
  CategoryScale,
  ...registerables
)
export default {
  name: 'LineChart',
  props: {
    canvasId: {
      type: String,
      default: 'line-chart'
    }
  },
  data () {
    return {
      chartData: {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [
            {
              label: '',
              data: [130, 100, 200, 300, 400],
              backgroundColor: 'rgba(white, 0)',
              borderColor: 'rgba(253,152,0,0.53)',
              borderWidth: 3,
              tension: 0.5
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              grid: {
                borderColor: '#474849',
                display: false
              }
            },
            y: {
              grid: {
                borderColor: '#474849',
                display: false
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      }
    }
  },
  mounted () {
    const ctx = document.getElementById(this.canvasId)
    // this.chartData.data.datasets = [{
    //   data: this.poolsData,
    //   backgroundColor: this.colorList
    // }]
    this.chart = new Chart(ctx, this.chartData)
  }
}
</script>

<style scoped>

</style>
