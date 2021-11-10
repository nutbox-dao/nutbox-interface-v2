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
        <!-- <span class="status">{{ index%2 === 0 ? 'remo' : ' active' }}</span> -->
        <span class="value">{{ item.value }}%</span>
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
                  return `${ctx.raw.name}: ${(Number(ctx.raw.value)).toFixed(2)}%`
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
                return Number(value.value).toFixed(2) + '%'
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
