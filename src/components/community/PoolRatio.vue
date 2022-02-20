<template>
  <div class="d-flex ratio-container">
    <div :style="{width:'100%', maxWidth: '20rem', ...chartStyle}">
      <canvas id="pie"></canvas>
    </div>
    <div v-if="showLegendInfo" class="legend-box flex-fill">
      <div
        class="legend-info"
        v-for="(item, index) of chartData.data.datasets[0].data"
        :key="index"
      >
              <span
                class="circle"
                :style="{ 'border-color': getColor(index)}"
              ></span>
        <span class="name font14">{{ item.name || "--" }}</span>
        <!-- <span class="status">{{ index%2 === 0 ? 'remo' : ' active' }}</span> -->
        <span class="value font14">{{ parseFloat(item.ratio) }}%</span>
      </div>
    </div>
  </div>
</template>

<script>
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
        '#FE6A07',
        '#7CBF4D',
        '#70ACFF',
        '#FFE14D',
        '#CC85FF',
        '#FF9500',
        '#00C7D9',
        '#9D94FF',
        '#FF73AD',
        '#FF7366',
        '#FF4D97',
        '#C881D2',
        '#DAD0ED',
        '#2780FD',
        '#00B9CD',
        '#91CF94',
        '#F4F5CE',
        '#FCB62E',
        '#FF9C26',
        '#FF7366',
        '#F57BA3',
        '#6456FF',
        '#70ACFF',
        '#5AD9E8',
        '#D1EAD2',
        '#9DAC00',
        '#FFE14D',
        '#FFCD7A'
      ],
      chartData: {
        type: 'doughnut',
        plugins: [ChartDataLabels],
        data: {
          labels: [],
          datasets: [
            {
              data: [{ ratio: 0, name: 'default' }]
            }
          ]
        },
        options: {
          responsive: true,
          cutout: '60%',
          parsing: {
            key: 'ratio'
          },
          layout: {
            padding: 70
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (ctx) {
                  return `${ctx.raw.name}: ${(Number(ctx.raw.ratio)).toFixed(2)}%`
                }
              }
            },
            datalabels: {
              color: 'white',
              clip: false,
              anchor: 'end',
              align: 'end',
              offset: 5,
              font: {
                weight: 'bold'
              },
              padding: 6,
              formatter: (value, ctx) => {
                if (this.showDataLabel) return value.name
                return Number(value.ratio).toFixed(2) + '%'
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
    },
    showLegendInfo: {
      type: Boolean,
      default: true
    },
    showDataLabel: {
      type: Boolean,
      default: false
    },
    animation: {
      type: Boolean,
      default: true
    },
    chartStyle: {
      type: Object,
      default: () => {
        return {}
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
    if (!this.animation) this.chartData.options.animation = false
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
.ratio-container {
  flex-direction: row-reverse;
}
.legend-box {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  justify-content: center;
  align-items: flex-start;
  margin: 2rem 0;
}

.legend-info {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 20rem;
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
    width: 40%;
    text-align: left;
  }
  .value {
    min-width: 4rem;
    text-align: right;
  }
}
@media (max-width: 560px) {
  .ratio-container {
    flex-direction: column!important;
    align-items: center;
  }
  .legend-box {
    width: 100%;
  }
  .legend-info .name {
    flex: 1;
  }
}
</style>
