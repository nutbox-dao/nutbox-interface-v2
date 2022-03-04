<template>
  <div class="sub-staking-page h-100 position-relative">
    <div class="scroll-content position-relative">
      <div class="top-card">
        <div class="desc-info font20 line-height32 font-bold">
          Nut Power introduction Nut Power introduction
          Nut Power introduction Nut Power introduction Nut Power introduction
        </div>
        <div class="v-line"></div>
        <NPAssetCard/>
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

  </div>
</template>

<script>
import CommunityNPCard from '@/components/community/CommunityNPCard'
import NPAssetCard from '@/components/community/NPAssetCard'
export default {
  name: 'SubCommunityStaking',
  components: { CommunityNPCard, NPAssetCard },
  data () {
    return {
      activeTab: 0,
      tabOptions: ['Acitive Pools', 'Inacitive Pools'],
      loading: false,
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
      ]
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
.asset-card {
  height: fit-content;
  flex: 1;
}
.desc-info {
  flex: 1;
}
@media  (max-width: 1060px) {
  .top-card {
    flex-direction: column;
  }
  .top-card .v-line {
    display: none;
  }
}
</style>
