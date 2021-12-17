<template>
  <div class="sub-staking-page">
    <div class="scroll-content position-relative">
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
          <button class="primary-btn w-auto" @click="activeTab = -1" style="height: 2rem">Inactive Pool</button>
        </div>
      </div>
      <div class="c-loading c-loading-absolute" v-if="loadingCommunityInfo"></div>
      <template v-else>
        <div v-if="stakingCards.length > 0"></div>
        <div class="empty-bg" v-else>
          <img src="~@/static/images/empty-data.png" alt="" />
          <p> {{ $t('tip.noProject') }} </p>
        </div>
        <div class="cards-container no-view-top-header">
          <div class="row">
            <div class="col-xl-4 col-md-6 mb-4" v-for="(cardInfo) of stakingCards" :key="cardInfo.id">
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
import  { mapState, mapGetters } from 'vuex'
import { getPoolFactoryAddress, updatePoolsByPolling } from '@/utils/web3/pool'
import { sleep } from '@/utils/helper'
import { getPools as getPoolsFromGraph} from '@/utils/graphql/pool'

export default {
  name: 'SubCommunityStaking',
  components: { CommunityStakingCard },
  data () {
    return {
      activeTab: 0,
      tabOptions: ['All', CHAIN_NAME, 'Steem', 'Hive'],
    }
  },
  computed: {
    ...mapState('currentCommunity', ['communityId', 'communityInfo', 'loadingCommunityInfo', 'allPools', 'feeRatio', 'cToken', 'specifyDistributionEras', 'operationHistory']),
    ...mapGetters('community', ['getCommunityInfoById']),
    stakingCards() {
      switch(this.activeTab) {
        case -1:
          return this.inActivedPools;
        case 0:
          return this.activedPools;
        case 1:
          return this.activedPools.filter(p => p.poolFactory.toLowerCase() === getPoolFactoryAddress('main'))
        case 2:
          return this.activedPools.filter(p => (p.poolFactory.toLowerCase() === getPoolFactoryAddress('steem')) && parseInt(p.chainId) == 1)
        case 3:
          return this.activedPools.filter(p => (p.poolFactory.toLowerCase() === getPoolFactoryAddress('hive')) && parseInt(p.chainId) == 2)
      }
    },
    activedPools() {
      if (!this.allPools || this.allPools.length === 0) return [];
      return this.allPools.filter(p => p.status === 'OPENED')
    },
    inActivedPools() {
      if (!this.allPools || this.allPools.length === 0) return [];
      return this.allPools.filter(p => p.status === 'CLOSED')
    }
  },
  async mounted() {
    while(true) {
      if (this.allPools) {
        break;
      }
      await sleep(0.3)
    }
    // monitor pools info
    console.log(111);
    const [stake, reward, approve] = await updatePoolsByPolling(this.allPools)
    console.log(22);
    const interval = setInterval(() => {
      console.log(62,3);
      getPoolsFromGraph(this.allPools.map(p => p.id))
    }, 6000)

    this.$once('hook:beforeDestroy', () => {
        stake.stop();
        console.log(1, 'close');
        reward.stop();
        approve.stop();
        window.clearInterval(interval)
        console.log(2, 'closed');
    })
  }
}
</script>

<style scoped>

</style>
