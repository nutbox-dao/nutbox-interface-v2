<template>
  <canvas :id="canvasId"></canvas>
</template>

<script>
import { mapState } from 'vuex'
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
  computed: {
    ...mapState('np', ['commonData'])
  },
  data () {
    return {
      chart: null,
      chartData: {
          type: 'line',
          data: {
            labels: [],
            datasets: [
              {
                label: '',
                data: [],
                backgroundColor: 'rgba(white,0)',
                borderColor: 'rgba(253,152,0,0.53)',
                borderWidth: 3,
                tension: 0.5
              }
            ]
          },
          options: {
            responsive: true,
            animation: true,
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
        },
      
    }
  },
  watch: {
    commonData(newValue, oldValue) {
      this.updateChart(newValue)
    }
  },
  methods: {
    getDate() {
      let day = new Date()
      const id = Math.ceil(day.getTime() / 86400000)
      let days = {}
      for (let i = 0; i < 7; i++){
        days[id - i] = day.getMonth() + '/' + day.getDate()
        day.setDate(day.getDate() - 1)
      }
      return days;
    },
    updateChart(value) {
      let chartData = {}
      if (value && value.length > 0) {
        const dayData = this.getDate()
        const labels = Object.values(dayData)
        let npData = {}
        for (let d of value) {
          npData[d.id] = d.nutStaked
        }
        let data = []
        for (let d of Object.keys(dayData).sort((a, b) => a > b)) {
          data.push(npData[d] ?? 0)
        }
          chartData = {
            labels,
            datasets: [
              {
                label: '',
                data,
                backgroundColor: 'rgba(white,0)',
                borderColor: 'rgba(253,152,0,0.53)',
                borderWidth: 3,
                tension: 0.5
              }
            ]
          }
      }else {
          chartData = {
            labels: [],
            datasets: [
              {
                label: "",
                data: [0,0,0,0,0,0,0],
                backgroundColor: 'rgba(white,0)',
                borderColor: 'rgba(253,152,0,0.53)',
                borderWidth: 3,
                tension: 0.5
              }
            ]
          }
      }

      // const ctx = document.getElementById(this.canvasId)
      // this.chart = new Chart(ctx, chartData)
      this.chart.data = chartData
      this.chart.update()
      this.chartData.options.animation = false
    }
  },
  mounted () {
    const ctx = document.getElementById(this.canvasId)
    this.chart = new Chart(ctx, this.chartData)
    this.updateChart(this.commonData)
  }
}
</script>

<style scoped>

</style>
