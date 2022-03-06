<template>
  <div class="asset-card">
    <div class="d-flex user-asset justify-content-between">
      <div class="font20 line-height28 font-bold">Nut Power</div>
      <div class="value-box">
        <div class="value-info">
          <div class="font20 line-height20">{{ (freeNp + lockedNp) | amountForm }} NP</div>
          <div class="font12 line-height12">= {{totalLockedNut | amountForm}} Nut</div>
        </div>
        <button class="primary-btn px-4 mx-0"
                @click="modalContentType='detail',assetModalVisible=true">Detail</button>
      </div>
    </div>
    <div class="chart-box position-relative">
      <PoolRatio class="asset-chart"
                 canvas-id="np-pie"
                 :pools-data="chartNp"
                 :chart-style="{width: '15rem'}"
                 :animation="false"
                 :show-data-label="true"
                 :show-legend-info="false"/>
    </div>
    <div class="c-loading c-loading-bg c-loading-absolute" v-if="loadingBalance"></div>
    <b-modal
      v-model="assetModalVisible"
      modal-class="custom-modal body-p0 sub-modal"
      :size="(modalContentType==='detail' || modalContentType==='up-step1')?'xl':''"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop>
      <NPAssetDetail v-show="modalContentType==='detail'"
                     @powerUp="onPowerUp"
                     @powerDown="modalContentType='power-down'"
                     @upgrade="setUpgradeData"
                     @close="assetModalVisible=false"/>
      <NPAssetPowerUpOptions v-if="modalContentType==='up-step1'"
                             :is-upgrade="isUpgrade"
                             :upgrade-data="upgradeData"
                             @setData="setData"
                             @back="modalContentType='detail'"
                             @close="assetModalVisible=false"/>
      <NPAssetPowerUp v-if="modalContentType==='power-up'"
                      :np-data="selectData"
                      @back="modalContentType='up-step1'"
                      @close="assetModalVisible=false"/>
      <NPAssetPowerDown v-if="modalContentType==='power-down'"
                        :np-data="selectData"
                        @back="modalContentType='detail'"
                        @close="assetModalVisible=false"/>
    </b-modal>
  </div>

</template>

<script>
import PoolRatio from '@/components/community/PoolRatio'
import NPAssetDetail from '@/components/community/NPAssetDetail'
import NPAssetPowerUpOptions from '@/components/community/NPAssetPowerUpOptions'
import NPAssetPowerUp from '@/components/community/NPAssetPowerUp'
import NPAssetPowerDown from '@/components/community/NPAssetPowerDown'
import { mapState } from 'vuex'
import { pollingNutBalance } from '@/utils/nutbox/nutpower'

export default {
  name: 'NPAssetCard',
  components: { PoolRatio, NPAssetDetail, NPAssetPowerUpOptions, NPAssetPowerUp, NPAssetPowerDown },
  data () {
    return {
      assetModalVisible: false,
      modalContentType: 'detail',
      loadingBalance: false,
      selectData: {},
      isUpgrade: false,
      upgradeData: {}
    }
  },
  computed: {
    ...mapState('np', ['balance', 'userLockedNut']),
    freeNp () {
      if (this.balance && this.balance.freeNp) {
        return this.balance.freeNp.toString() / 1e18
      }
      return 0
    },
    lockedNp () {
      if (this.balance && this.balance.lockedNp) {
        return this.balance.lockedNp.toString() / 1e18
      }
      return 0
    },
    totalNp () {
      if (this.freeNp && this.lockedNp) {
        return this.freeNp + this.lockedNp
      }
      return 0
    },
    totalLockedNut () {
      return this.userLockedNut.reduce((s, n) => s + n, 0)
    },
    chartNp () {
      if (this.totalNp == 0) {
        return []
      }
      return [
        { ratio: this.freeNp / this.totalNp, name: 'Free' },
        { ratio: this.lockedNp / this.totalNp, name: 'Available' }
      ]
    }
  },
  methods: {
    onPowerUp() {
      this.isUpgrade = false
      this.modalContentType='up-step1'
    },
    setData (data) {
      if (this.isUpgrade && data.srcPeriod >= data.distPeriod) return
      this.modalContentType = 'power-up'
      console.log('235', data);
      this.selectData = data
    },
    setUpgradeData (data) {
      this.modalContentType = 'up-step1'
      this.isUpgrade = true
      this.upgradeData = data
      console.log(this.upgradeData)
    }
  },
  async mounted () {
    const polling = await pollingNutBalance();
    this.$once('hook:beforeDestroy', () => {
      polling.stop()
    })
  },
}
</script>

<style scoped lang="scss">
.asset-card {
  @include card();
  border-radius: 0 .8rem .8rem 0;
  height: 200px;
  display: flex;
  .chart-box {
    position: relative;
    flex: 1;
  }
  .asset-chart {
    position: absolute;
    width: 100%;
    max-width: 14rem;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }
  .user-asset {
    flex-direction: column;
    .primary-btn {
      width: fit-content;
    }
  }
  .value-info {
    margin-bottom: 2rem;
  }
}
//@media  (max-width: 1060px) {
//  .asset-card {
//    margin-top: 2rem;
//  }
//}
@media (max-width: 576px) {
  .asset-card {
    height: 24rem;
    display: flex;
    flex-direction: column;
    .asset-chart {
      position: relative;
      margin: auto;
      top: 0;
      right: 0;
      width: 16rem;
    }
    .value-box {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    .value-info {
      margin-bottom: 0;
    }
  }
}
@media (max-width: 576px) {
  .asset-card .asset-chart {
    transform: translateY(0);
  }
}
</style>
