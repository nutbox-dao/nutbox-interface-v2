<template>
  <div class="row">
    <div class="col-lg-6 col-md-7">
      <canvas id="pie"></canvas>
    </div>
    <div class="col-lg-6 col-md-5 legend-box">
      <div
        class="legend-info"
        v-for="(item, index) of chartData.data.datasets[0].data"
        :key="index"
      >
              <span
                class="circle"
                :style="{ 'border-color': getColor(index)}"
              ></span>
        <span class="name">{{ item.name || "--" }}</span>
        <span class="value">{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@/i18n'
import {
  Chart,
  ArcElement,
  DoughnutController,
  Tooltip
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
Chart.register(
  ArcElement,
  DoughnutController,
  Tooltip
)
export default {
  name: 'PieChart',
  data () {
    return {
      chart: null,
      colorList: [
        '#FF7366',
        '#7CBF4D',
        '#70ACFF',
        '#FFE14D',
        '#CC85FF',
        '#FF9500',
        '#00C7D9',
        '#9D94FF',
        '#FF73AD'
      ],
      chartData: {
        type: 'doughnut',
        plugins: [ChartDataLabels],
        data: {
          labels: [],
          datasets: [
            {
              data: [{ value: 0, name: 'default' }]
            }
          ]
        },
        options: {
          responsive: true,
          parsing: {
            key: 'value'
          },
          layout: {
            padding: 60
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (ctx) {
                  let sum = 0
                  const dataArr = ctx.chart.data.datasets[0].data
                  dataArr.map(data => {
                    sum += Number(data.value)
                  })
                  return `${i18n.t(
                    'percentage'
                  )}: ${(Number(ctx.parsed) * 100 / sum).toFixed(2)}%`
                }
              }
            },
            datalabels: {
              color: 'black',
              clip: false,
              anchor: 'end',
              align: 'end',
              offset: 10,
              font: {
                weight: 'bold'
              },
              padding: 6,
              formatter: (value, ctx) => {
                let sum = 0
                const dataArr = ctx.chart.data.datasets[0].data
                dataArr.map(data => {
                  sum += Number(data.value)
                })
                return (Number(value.value) * 100 / sum).toFixed(2) + '%'
              }
            }
          }
        }
      }
    }
  },
  computed: {
    getColor () {
      return (index) => {
        return this.colorList[index % this.colorList.length]
      }
    }
  },
  props: {
    poolsData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    poolsData: {
      handler: function (data) {
        this.chartData.data.datasets = [{
          data: data,
          backgroundColor: this.colorList
        }]
        this.chart.update()
      },
      deep: true
    }
  },
  mounted () {
    const ctx = document.getElementById('pie')
    this.chartData.data.datasets = [{
      data: this.poolsData,
      backgroundColor: this.colorList
    }]
    this.chart = new Chart(ctx, this.chartData)
  }
}
</script>

<style scoped lang="scss">
.legend-box {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
}

.legend-info {
  display: flex;
  align-items: center;

  span {
    display: inline-block;
  }

  .circle {
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 1rem;
    margin-right: 0.6rem;
    border: 0.2rem solid;
  }
  .name {
    width: 10rem;
    text-align: left;
  }
  .value {
    min-width: 4rem;
    text-align: right;
  }
}
</style>
