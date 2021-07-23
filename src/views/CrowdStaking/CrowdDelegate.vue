<template>
  <div class="k-page crowdstaking-page">
    <div class="loading-bg" v-if="loading">
      <img src="~@/static/images/loading.gif" alt="" />
      <p class="font16">{{ $t('tip.loading') }}</p>
    </div>
    <template v-else>
      <div v-if="delegateCards.length > 0"></div>
      <div class="empty-bg" v-else>
        <img src="~@/static/images/empty-data.png" alt="" />
        <p> {{ $t('tip.noProject') }} </p>
      </div>
      <div class="cards-container">
        <div class="row">
          <div class="col-xl-4 col-md-6 mb-4" v-for="(card, idx) of delegateCards" :key="idx">
            <CrowdDelegateCard :card='card'/>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import CrowdDelegateCard from '@/components/CrowdStaking/CrowdDelegateCard'
import { mapState } from 'vuex'

export default {
  name: 'CrowdDelegate',
  components: {
    CrowdDelegateCard
  },
  computed: {
    ...mapState({
      allPools: state => state.web3.allPools,
    }),
    delegateCards () {
      return this.allPools? this.allPools.filter(p => p.type === "SteemHiveDelegateAssetRegistry") : []
    },
    loading () {
      return this.allPools === null
    }
  },
}
</script>

<style lang="scss" scoped>
</style>
