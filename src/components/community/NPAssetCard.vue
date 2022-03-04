<template>
  <div class="asset-card">
    <div class="d-flex user-asset justify-content-between">
      <div class="font20 line-height28 font-bold">Nut Power</div>
      <div class="value-box">
        <div class="value-info">
          <div class="font20 line-height20">12000 NP</div>
          <div class="font12 line-height12">= 1000 Nut</div>
        </div>
        <button class="primary-btn px-4 mx-0"
                @click="modalContentType='detail',assetModalVisible=true">Detail</button>
      </div>
    </div>
    <div class="chart-box position-relative">
      <PoolRatio class="asset-chart"
                 canvas-id="np-pie"
                 :pools-data="chartToken"
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
                     @powerUp="modalContentType='up-step1'"
                     @powerDown="modalContentType='power-down'"
                     @close="assetModalVisible=false"/>
      <NPAssetPowerUpOptions v-if="modalContentType==='up-step1'"
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
export default {
  name: 'NPAssetCard',
  components: { PoolRatio, NPAssetDetail, NPAssetPowerUpOptions, NPAssetPowerUp, NPAssetPowerDown },
  data () {
    return {
      assetModalVisible: false,
      modalContentType: 'detail',
      chartToken: [
        { ratio: 100, name: 'AAA' },
        { ratio: 10, name: 'BBB' }
      ],
      loadingBalance: false,
      selectData: {}
    }
  },
  methods: {
    setData (data) {
      this.modalContentType = 'power-up'
      this.selectData = data
    }
  }
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
