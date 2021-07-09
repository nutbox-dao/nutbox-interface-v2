<template>
  <div class="page-view-content">
    <div class="fixed-header page-back-text-icon font20" @click="$router.back()">Add Pool</div>
    <div class="scroll-content">
      <div class="pool-card text-left">
        <div class="line-card-title">Pool Rations</div>
        <div class="row">
          <div class="col-lg-6 col-md-7">
            <div id="pie"></div>
          </div>
          <div class="col-lg-6 col-md-5 legend-box">
            <div class="legend-info" v-for="(item, index) of options.series[0].data" :key="index">
              <span class="circle" :style="{'border-color': colorList[index]}"></span>
              <span class="name">{{ item.name }}</span>
              <span class="value">{{ item.value }}</span>
            </div>
          </div>
        </div>
        <div class="divide-box">
          <div class="line-card-title">Pool Information</div>
        </div>
        <b-form class="custom-form pool-form">
          <b-form-group id="input-group-1"
                        label="Staking Asset"
                        label-for="input-1">
            <b-form-input
              id="input-1"
              v-model="form.amount"
              placeholder="Please select an asset"
              required
            ></b-form-input>
            <div class="flex-between-center">
                <div class="custom-control" style="line-height: 1.5rem">
                  <span v-show="isHomeChainAsset">* This is a homechian asset</span>
                  <span v-show="!isHomeChainAsset">* This is a foreignchain asset</span>
                  <router-link to="/community/register/native">Registry a new asset</router-link>
                </div>
              </div>
          </b-form-group>
          <div class="row">
            <b-form-group class="col-md-6"
                          id="input-group-2"
                          label="Pool Name"
                          label-for="input-2">
              <b-form-input
                id="input-2"
                v-model="form.name"
                placeholder="Please enter"
                required
              ></b-form-input>
            </b-form-group>
          </div>
          <b-form-group id="input-group-2"
                        label="Pool Rations">
            <div class="rations-box">
              <div class="text-center item-box"
                   v-for="(inputItem, inputIndex) of form.rations" :key="inputIndex">
                <b-form-input class="ration-input"
                              :data-label="options.series[0].data[inputIndex].name"
                              v-model="form.rations[inputIndex]"
                              @input="inputChange"
                              type="number"
                ></b-form-input>
                <span class="font12 text-grey mt-1">{{ options.series[0].data[inputIndex].name }}</span>
              </div>
            </div>
          </b-form-group>
          <div class="row">
            <div class="col-md-5">
              <button class="primary-btn">Add Pool</button>
            </div>
          </div>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts/core'
import debounce from 'lodash.debounce'

export default {
  name: 'AddPool',
  data () {
    return {
      isHomeChainAsset: true,
      colorList: ['#FF7366', '#7CBF4D', '#70ACFF', '#FFE14D', '#CC85FF', '#FF9500', '#00C7D9', '#9D94FF', '#FF73AD'],
      options: {
        tooltip: { show: true, trigger: 'item' },
        legend: { show: false },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['40%', '60%'], // 圆环大小
            avoidLabelOverlap: false,
            label: {
              show: true,
              formatter: '{d}%',
              fontSize: 14,
              fontWeight: 'bolder'
            },
            labelLine: {
              show: false
            },
            tooltip: {
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              extraCssText: 'box-shadow: 0 4 12px 4px rgba(0, 0, 0, 0.05); border-radius: .6rem;',
              borderWidth: 0,
              textStyle: {
                color: '#242629',
                fontSize: 12
              },
              formatter: `<div class="c-tooltip"><span>Pool</span><span>{b0}</span></div>
                <div class="c-tooltip"><span>${this.$i18n.t('percentage')}</span><span>{d}%</span></div>`
              // 饼图、仪表盘、漏斗图: {a}（系列名称），{b}（数据项名称），{c}（数值）, {d}（百分比）
            },
            data: [{ value: 0, name: 'default' }]
          }
        ]
      },
      form: {
        amount: '',
        name: '',
        rations: [0]
      }
    }
  },
  mounted () {
    this.initChart()
  },
  methods: {
    initChart () {
      this.chart = echarts.init(document.getElementById('pie'))
      this.setData()
      this.chart.setOption(this.options)
    },
    setData () {
      this.options.color = this.colorList
      const data = [
        { value: 45, name: 'PNUT-TRX LP' },
        { value: 20, name: 'PNUT-TSP LP' },
        { value: 20, name: 'PNUT-TSP1 LP' },
        { value: 30, name: 'TSP-TRC LP' },
        { value: 30, name: 'TSP-TRC2 LP' },
        { value: 30, name: 'TSP-TRC3 LP' },
        { value: 30, name: 'TSP-TRC4 LP' }
      ]
      this.options.series[0].data = data
      this.form.rations = data.map(item => {
        return item.value
      })
    },
    inputChange: debounce(function () {
      this.options.series[0].data.map((item, index) => {
        item.value = this.form.rations[index]
      })
      this.chart.setOption(this.options)
    }, 1500)
  }
}
</script>

<style scoped lang="scss">
@import "src/static/css/form";

.page-back-text-icon {
  margin-bottom: 2.3rem;
}

.pool-card {
  @include card(1.6rem 0);
  height: auto;

  .line-card-title {
    font-size: 1rem;
    line-height: 1rem;
    font-weight: bold;
    padding-left: 1.2rem;
    @include single-color-bg(.2rem 1rem, left center);
  }

  .legend-box {
    display: flex;
    flex-direction: column;
    gap: .8rem;
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
      width: .7rem;
      height: .7rem;
      border-radius: 1rem;
      margin-right: .6rem;
      border: .2rem solid;
    }
    .name {
      width: 10rem;
    }
    .value {
      min-width: 4rem;
      text-align: right;
    }
  }

  .divide-box {
    background-image: linear-gradient(to bottom, #F6F7F9, #FFFFFF);
    padding: 1.6rem 0 .4rem;
  }
}

#pie {
  width: 100%;
  height: 15rem;
}

.pool-form {
  padding: 1rem 1.2rem 0;

  .rations-box {
    display: flex;
    flex-flow: wrap;
  }

  .item-box {
    padding-left: .2rem;
    padding-right: .8rem;
    @include single-color-bg(.6rem .1rem, right 1.2rem, #BDBFC2)
  }

  .item-box:first-child {
    padding-left: 0;
  }

  .item-box:last-child {
    padding-right: 0;
  }

  .ration-input {
    width: 5.8rem;
    text-align: center;
    font-size: 1rem;
    font-weight: bolder;

    &::after {
      content: '--';
    }
  }
}
</style>
