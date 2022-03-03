<template>
  <div class="sub-staking-page h-100 position-relative">
    <div class="scroll-content position-relative">
      <div class="top-card">
        <div class="desc-info font20 line-height32 font-bold">
          Nut Power introduction Nut Power introduction
          Nut Power introduction Nut Power introduction Nut Power introduction
        </div>
        <div class="v-line"></div>
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
                       :pools-data="chartToken"
                       :aspect-ratio="3/2"
                       :animation="false"
                       :show-data-label="true"
                       :show-legend-info="false"/>
          </div>
          <div class="c-loading c-loading-bg c-loading-absolute" v-if="loadingBalance"></div>
        </div>
      </div>
      <div class="c-loading my-5" v-if="loading"></div>
      <template v-else>
        <div class="empty-bg" v-if="npCards.length === 0">
          <img src="~@/static/images/empty-data.png" alt="" />
          <p> {{ $t('tip.noProject') }} </p>
        </div>
        <div v-else class="cards-container">
          <div class="cards-box cards-box-col3" :class="'col3-items-'+npCards.length">
            <div class="card-item" v-for="(cardInfo) of npCards" :key="cardInfo.id">
              <CommunityNPCard :card="cardInfo"/>
            </div>
          </div>
        </div>
      </template>
    </div>
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
import CommunityNPCard from '@/components/community/CommunityNPCard'
import NPAssetDetail from '@/components/community/NPAssetDetail'
import NPAssetPowerUpOptions from '@/components/community/NPAssetPowerUpOptions'
import NPAssetPowerUp from '@/components/community/NPAssetPowerUp'
import NPAssetPowerDown from '@/components/community/NPAssetPowerDown'
export default {
  name: 'SubCommunityStaking',
  components: { PoolRatio, CommunityNPCard, NPAssetDetail, NPAssetPowerUpOptions, NPAssetPowerUp, NPAssetPowerDown },
  data () {
    return {
      activeTab: 0,
      tabOptions: ['Acitive Pools', 'Inacitive Pools'],
      loading: false,
      assetModalVisible: false,
      modalContentType: 'detail',
      chartToken: [
        { ratio: 100, name: 'AAA' },
        { ratio: 10, name: 'BBB' }
      ],
      loadingBalance: false,
      npCards: [
        {
          asset: '0x232c5c39120140b76e3466ee8303465cf4b9c04d',
          chainId: 0,
          community: { id: '0x72701a017a9e0677b9401bf7473da36b1bbb888e' },
          id: '0x3fb7e48eab43fc427360fea8547a78966495b8d4',
          name: 'Stake PNUT-WBNB',
          poolFactory: '0xf870724476912057c807056b29c1161f5fe0199a',
          ratio: 10000,
          stakers: [{ id: '0x092146598ae9be2ca420c0f3503612ed946d1139' }],
          stakersCount: 17,
          status: 'OPENED',
          totalAmount: '5890865817022064098000'
        }
      ],
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
.sub-staking-page {
  overflow: auto;
}
.card-item {
  width: 354px;
  height: 434px;
}
.top-card {
  @include card();
  height: fit-content;
  display: flex;
  margin-bottom: 1rem;
  .v-line {
    width: 2px;
    height: 8rem;
    background-color: var(--dividers);
    margin: auto 2.4rem;
  }
}
.desc-info {
  flex: 1;
}
.asset-card {
  flex: 1;
  min-height: 10rem;
  display: flex;
  .chart-box {
    position: relative;
    flex: 1;
  }
  .asset-chart {
    position: absolute;
    width: 100%;
    max-width: 14rem;
    //top: -2rem;
    right: 1.2rem;
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
@media  (max-width: 1060px) {
  .top-card {
    flex-direction: column;
  }
  .top-card .v-line {
    display: none;
  }
  .asset-card {
    margin-top: 2rem;
  }
}
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
@media (min-width: 577px) and (max-width: 991px) {
  .asset-card {
    height: 11rem;
  }
}
</style>
