<template>
  <div class="page-view-content">
    <div class="scroll-content container">
      <div class="view-top-header">
        <div class="page-back-text-icon font20 m-0" @click="$router.back()">
          {{ $t("asset.updatePool") }}
        </div>
      </div>
      <div class="pool-card text-left mb-5">
        <div class="line-card-title">{{ $t("asset.poolRatios") }}</div>
        <PoolRatio :pools-data="myPools"/>
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
                  :data-label="myPools[inputIndex].name"
                  :disabled="
                    myPools[inputIndex].hasStopped ||
                    myPools[inputIndex].hasRemoved
                  "
                  v-model="form.ratios[inputIndex]"
                  @input="inputChange"
                  step="0.01"
                  type="number"
                ></b-form-input>
                <span class="font12 text-grey mt-1" :style="'color:' + ((myPools[inputIndex].hasRemoved || myPools[inputIndex].hasStopped) ? 'red' : '')">{{
                  myPools[inputIndex].name +
                  (myPools[inputIndex].hasRemoved
                    ? ("(" + $t("community.Removed") + ")")
                    : (myPools[inputIndex].hasStopped
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
import debounce from "lodash.debounce";
import Dropdown from "@/components/ToolsComponents/Dropdown";
import { updatePoolsRatio, getMyOpenedPools } from "@/utils/web3/pool";
import { handleApiErrCode } from "@/utils/helper";
import PoolRatio from "@/components/Community/PoolRatio";

export default {
  name: "AddPool",
  components: { Dropdown, PoolRatio },
  data() {
    return {
      isHomeChainAsset: true,
      updating: true,
      myPools: [],
      form: {
        assetId: "",
        name: "",
        ratios: [],
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
  computed: {
    getColor() {
      return (index) => {
        return this.colorList[index % this.colorList.length]
      }
    }
  },
  async mounted() {
    getMyOpenedPools()
      .then((pools) => {
        this.setData(pools);
        this.updating = false;
      })
      .catch((e) => {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param);
        });
      });
  },
  methods: {
    // initChart(pools) {
    //   const ctx = document.getElementById('pie')
    //   this.chart = new Chart(ctx, this.chartData)
    //   this.setData(pools)
    // },
    setData(pools) {
      this.myPools = pools.map((pool) => ({
        ...pool,
        name: pool.poolName,
        value: (pool.hasStopped || pool.hasRemoved) ? 0 : pool.poolRatio / 100,
      }));
      this.form.ratios = this.myPools.map((item) => {
        return item.value;
      });
    },
    inputChange: debounce(function () {
      this.myPools.map((item, index) => {
        item.value = this.form.ratios[index];
      });
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
