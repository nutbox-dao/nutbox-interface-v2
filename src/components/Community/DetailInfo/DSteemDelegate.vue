<template>
  <div class="delegate-block">
    <div class="loading-bg" v-if="loadingAllPools">
      <img src="~@/static/images/loading.gif" alt="" />
      <p class="font16">{{ $t('tip.loading') }}</p>
    </div>
    <template v-else>
      <div v-if="steemDelegatePools.length > 0"></div>
      <div class="empty-bg" v-else>
        <img src="~@/static/images/empty-data.png" alt="" />
        <p> {{ $t('tip.noProject') }} </p>
      </div>
      <div class="cards-container">
        <div class="row">
          <div class="col-xl-4 col-md-6 mb-4" v-for="(card, idx) of steemDelegatePools" :key="card.pid + '' + idx">
            <DDelegateCard :card='card'/>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import DDelegateCard from '@/components/Community/DetailInfo/Cards/DSteemDelegateCard'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'DDelegate',
  components: {
    DDelegateCard
  },
  computed: {
  ...mapState({
    steemAccount: state => state.steem.steemAccount,
    loadingAllPools: state => state.web3.loadingAllPools
  }),
  },
  props: {
    steemDelegatePools: {
      type: Array,
      default: []
    },
  },
  methods: {
    ...mapActions('steem', ['getVests', 'getSteem'])
  },
  mounted () {
    if(this.steemAccount && this.steemAccount.length > 0){
      this.getVests();
      this.getSteem();
    }
  },

}
</script>

<style lang="scss" scoped>
</style>
