<template>
  <div class="staking-block">
    <div class="loading-bg" v-if="loadingAllPools">
      <img src="~@/static/images/loading.gif" alt="" />
      <p class="font16">{{ $t('tip.loading') }}</p>
    </div>
    <template v-else>
      <div v-if="erc20Pools.length > 0"></div>
      <div class="empty-bg" v-else>
        <img src="~@/static/images/empty-data.png" alt="" />
        <p> {{ $t('tip.noProject') }} </p>
      </div>
      <div class="cards-container">
        <div class="row">
          <div class="col-xl-4 col-md-6 mb-4" v-for="(card, idx) of erc20Pools" :key="idx">
            <DStakingCard :card="card"/>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import DStakingCard from '@/components/Community/DetailInfo/Cards/DStakingCard'
import { mapState } from 'vuex'

export default {
  name: 'DCrowdStaking',
  components: {
    DStakingCard
  },
  props: {
    erc20Pools: {
      type: Array,
    },
  },
  computed: {
    ...mapState('polkadot', ['crowdstakings']),
    ...mapState('web3', ['loadingAllPools'])
  }
}
</script>

<style lang="scss" scoped>
</style>
