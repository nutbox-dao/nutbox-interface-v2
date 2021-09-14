<template>
  <div class="nominate-block">
    <div class="loading-bg" v-if="loadingAllPools">
      <img src="~@/static/images/loading.gif" alt="" />
      <p class="font16">{{ $t('tip.loading') }}</p>
    </div>
    <template v-else>
      <div v-if="nominateCards.length > 0"></div>
      <div class="empty-bg" v-else>
        <img src="~@/static/images/empty-data.png" alt="" />
        <p> {{ $t('tip.noProject') }} </p>
      </div>
      <div class="cards-container">
        <div class="row">
          <div class="col-xl-4 col-md-6 mb-4" v-for="(card, idx) of nominateCards" :key="idx">
            <CrowdNominateCard :nomination="card"/>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import CrowdNominateCard from '@/components/CrowdStaking/CrowdNominateCard'
import { mapState, mapGetters } from 'vuex'
import { subNominators } from '@/utils/commen/crowdStaking'

export default {
  name: 'CrowdNominate',
  components: {
    CrowdNominateCard
  },
  computed: {
    ...mapState({
      loadingAllPools: state => state.web3.loadingAllPools
    }),
    ...mapGetters('web3', ['poolCards']),
    data () {
      const { poolCards, allParachain } = this
      return { poolCards, allParachain }
    },
    nominateCards (){
      return this.poolCards.filter(item => item.type === 'SubstrateNominateAssetRegistry')
    }
  },
  mounted () {
    // get parachian info from backend
    subNominators('kusama')
    subNominators('polkadot')
  }
}
</script>

<style lang="scss" scoped>
</style>
