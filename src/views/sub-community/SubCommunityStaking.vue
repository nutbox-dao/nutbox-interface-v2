<template>
  <div class="sub-staking-page">
    <div class="scroll-content">
      <div class="row">
        <div class="col-md-6">
          <div class="nav-box nav-box-bg mb-3 mb-md-0">
            <div class="nav">
                <span v-for="(item, index) of tabOptions" :key="index"
                      :class="activeTab===index?'active':''"
                      @click="activeTab = index">{{item}}</span>
            </div>
          </div>
        </div>
        <div class="col-md-6 text-right">
          <button class="primary-btn w-auto" style="height: 2rem">Inactive Pool</button>
        </div>
      </div>
      <div class="loading-bg" v-if="loadingAllPools">
        <img src="~@/static/images/loading.gif" alt="" />
        <p class="font16">{{ $t('tip.loading') }}</p>
      </div>
      <template v-else>
        <div v-if="stakingCards.length > 0"></div>
        <div class="empty-bg" v-else>
          <img src="~@/static/images/empty-data.png" alt="" />
          <p> {{ $t('tip.noProject') }} </p>
        </div>
        <div class="cards-container no-view-top-header">
          <div class="row">
            <div class="col-xl-4 col-md-6 mb-4" v-for="(cardInfo, index) of stakingCards" :key="index">
              <CommunityStakingCard :card="cardInfo"/>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { CHAIN_NAME } from '@/config'
import CommunityStakingCard from '@/components/community/CommunityStakingCard'

export default {
  name: 'SubCommunityStaking',
  components: { CommunityStakingCard },
  data () {
    return {
      activeTab: 0,
      tabOptions: ['All', CHAIN_NAME, 'Polkadot', 'Steem', 'Hive'],
      loadingAllPools: false,
      stakingCards: [],
      mockData: {

      }
    }
  }
}
</script>

<style scoped>

</style>
