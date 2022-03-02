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
              <button class="primary-btn px-4 mx-0" @click="assetModalVisible=true">Detail</button>
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
<!--        <div v-if="stakingCards.length > 0"></div>-->
<!--        <div class="empty-bg" v-else>-->
<!--          <img src="~@/static/images/empty-data.png" alt="" />-->
<!--          <p> {{ $t('tip.noProject') }} </p>-->
<!--        </div>-->
<!--        <div class="cards-container">-->
<!--          <div class="cards-box cards-box-col3" :class="'col3-items-'+stakingCards.length">-->
<!--            <div class="card-item" v-for="(cardInfo) of stakingCards" :key="cardInfo.id">-->
<!--              <CommunityStakingCard :card="cardInfo"/>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
      </template>
    </div>
  </div>
</template>

<script>
import PoolRatio from '@/components/community/PoolRatio'

export default {
  name: 'SubCommunityStaking',
  components: { PoolRatio },
  data () {
    return {
      activeTab: 0,
      tabOptions: ['Acitive Pools', 'Inacitive Pools'],
      loading: false,
      assetModalVisible: false,
      chartToken: [
        { ratio: 100, name: 'AAA' },
        { ratio: 10, name: 'BBB' }
      ],
      loadingBalance: false
    }
  }
}
</script>

<style scoped lang="scss">
.sub-staking-page {
  overflow: auto;
}
.top-card {
  @include card();
  height: fit-content;
  display: flex;
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
