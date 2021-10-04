<template>
  <div class="page-view-content">
    <div class="scroll-content container">
      <div class="view-top-header">
        <div class="page-back-text-icon font20 m-0" @click="$router.back()">
          {{ $t("asset.addPool") }}
        </div>
      </div>
      <div class="pool-card text-left mb-5">
        <div class="line-card-title">{{ $t("asset.poolRatios") }}</div>
        <div class="row">
          <div class="col-lg-6 col-md-7">
            <div id="pie"></div>
          </div>
          <div class="col-lg-6 col-md-5 legend-box">
            <div
              class="legend-info"
              v-for="(item, index) of options.series[0].data"
              :key="index"
            >
              <span
                class="circle"
                :style="{ 'border-color': colorList[index] }"
              ></span>
              <span class="name">{{ item.name || "--" }}</span>
              <span class="value">{{ item.value }}</span>
            </div>
          </div>
        </div>
        <div class="divide-box">
          <div class="line-card-title">{{ $t("asset.poolInfo") }}</div>
        </div>
        <div class="custom-form pool-form">
          <b-form-group id="input-group-2" :label="$t('asset.poolRatios')">
            <div class="ratios-box">
              <div
                class="text-center item-box"
                v-for="(inputItem, inputIndex) of form.ratios"
                :key="inputIndex"
              >
                <b-form-input
                  class="ration-input"
                  :data-label="options.series[0].data[inputIndex].name"
                  :disabled="
                    options.series[0].data[inputIndex].hasStopped ||
                    options.series[0].data[inputIndex].hasRemoved
                  "
                  v-model="form.ratios[inputIndex]"
                  @input="inputChange"
                  step="0.01"
                  type="number"
                ></b-form-input>
                <span class="font12 text-grey mt-1" :style="'color:' + ((options.series[0].data[inputIndex].hasRemoved || options.series[0].data[inputIndex].hasStopped) ? 'red' : '')">{{
                  options.series[0].data[inputIndex].name +
                  (options.series[0].data[inputIndex].hasRemoved
                    ? ("(" + $t("community.Removed") + ")")
                    : (options.series[0].data[inputIndex].hasStopped
                    ? ('(' + $t("community.Stopped") + ')')
                    : ""))
                }}</span>
              </div>
            </div>
          </b-form-group>
          <div class="row">
            <div class="col-md-5">
              <button
                class="primary-btn"
                @click="confirmUpdate"
                :disabled="updating"
              >
                <b-spinner small type="grow" v-show="updating" />
                {{ $t("commen.update") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts/core";
import debounce from "lodash.debounce";
import Dropdown from "@/components/ToolsComponents/Dropdown";
import { updatePoolsRatio, getMyOpenedPools } from "@/utils/web3/pool";
import { handleApiErrCode } from "@/utils/helper";

export default {
  name: "AddPool",
  components: { Dropdown },
  data() {
    return {
      isHomeChainAsset: true,
      updating: true,
      myPools: [],
      colorList: [
        "#FF7366",
        "#7CBF4D",
        "#70ACFF",
        "#FFE14D",
        "#CC85FF",
        "#FF9500",
        "#00C7D9",
        "#9D94FF",
        "#FF73AD",
      ],
      options: {
        tooltip: { show: true, trigger: "item" },
        legend: { show: false },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["40%", "60%"], // 圆环大小
            avoidLabelOverlap: false,
            label: {
              show: true,
              formatter: "{d}%",
              fontSize: 14,
              fontWeight: "bolder",
            },
            labelLine: {
              show: false,
            },
            tooltip: {
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              extraCssText:
                "box-shadow: 0 4 12px 4px rgba(0, 0, 0, 0.05); border-radius: .6rem;",
              borderWidth: 0,
              textStyle: {
                color: "#242629",
                fontSize: 12,
              },
              formatter: `<div class="c-tooltip"><span>Pool</span><span>{b0}</span></div>
                <div class="c-tooltip"><span>${this.$i18n.t(
                  "percentage"
                )}</span><span>{d}%</span></div>`,
              // 饼图、仪表盘、漏斗图: {a}（系列名称），{b}（数据项名称），{c}（数值）, {d}（百分比）
            },
            data: [{ value: 0, name: "default" }],
          },
        ],
      },
      form: {
        assetId: "",
        name: "",
        ratios: [0],
      },
      selectedKey: "name",
      selectedAddressData: {},
      concatAddressOptions: [
        {
          categoryName: "personal",
          items: [{ name: "AAA", address: "0x000" }],
        },
        {
          categoryName: "official",
          items: [],
        },
      ],
      assetLoading: true,
    };
  },
  async mounted() {
    getMyOpenedPools()
      .then((pools) => {
        this.initChart(pools);
        this.updating = false;
      })
      .catch((e) => {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param);
        });
      });
  },
  methods: {
    initChart(pools) {
      this.chart = echarts.init(document.getElementById("pie"));
      this.setData(pools);
      this.chart.setOption(this.options);
    },
    setData(pools) {
      this.options.color = this.colorList;
      this.myPools = pools.map((pool) => ({
        ...pool,
        name: pool.poolName,
        value: (pool.hasStopped || pool.hasRemoved) ? 0 : pool.poolRatio / 100,
      }));
      this.options.series[0].data = this.myPools;
      this.form.ratios = this.myPools.map((item) => {
        return item.value;
      });
    },
    inputChange: debounce(function () {
      this.options.series[0].data.map((item, index) => {
        item.value = this.form.ratios[index];
      });
      this.chart.setOption(this.options);
    }, 1500),
    checkInput() {
      let tipStr = "";
      if (
        this.form.ratios.reduce((t, r) => t + parseInt(r * 100), 0) != 10000
      ) {
        tipStr = this.$t("tip.ratioError");
      } else {
        return true;
      }
      this.$bvToast.toast(tipStr, {
        title: this.$t("tip.tips"),
        variant: "info",
      });
      console.log(tipStr);
    },
    async confirmUpdate() {
      if (!this.checkInput()) return;

      // update pool
      try {
        this.updating = true;
        const hash = await updatePoolsRatio(this.form.ratios);
        this.$bvToast.toast(this.$t("community.updatePoolSuccess"), {
          title: this.$t("tip.success"),
          variant: "success",
        });
        try {
          await getMyOpenedPools(true);
          this.$router.back();
        } catch (e) {}
      } catch (e) {
        handleApiErrCode(e, (info, para) => {
          this.$bvToast.toast(info, para);
        });
      } finally {
        this.updating = false;
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "src/static/css/form";
s .page-back-text-icon {
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
    @include single-color-bg(0.2rem 1rem, left center);
  }

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
    }
    .value {
      min-width: 4rem;
      text-align: right;
    }
  }

  .divide-box {
    background-image: linear-gradient(to bottom, #f6f7f9, #ffffff);
    padding: 1.6rem 0 0.4rem;
  }
}

#pie {
  width: 100%;
  height: 15rem;
}

.pool-form {
  padding: 1rem 1.2rem 0;

  .ratios-box {
    display: flex;
    flex-flow: wrap;
  }

  .item-box {
    padding-left: 0.2rem;
    padding-right: 0.8rem;
    @include single-color-bg(0.6rem 0.1rem, right 1.2rem, #bdbfc2);
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
      content: "--";
    }
  }
}
</style>
