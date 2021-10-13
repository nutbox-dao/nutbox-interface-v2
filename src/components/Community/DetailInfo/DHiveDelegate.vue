<template>
  <div class="delegate-block">
    <div class="loading-bg" v-if="loadingAllPools">
      <img src="~@/static/images/loading.gif" alt="" />
      <p class="font16">{{ $t('tip.loading') }}</p>
    </div>
    <template v-else>
      <div v-if="hiveDelegatePools.length > 0"></div>
      <div class="empty-bg" v-else>
        <img src="~@/static/images/empty-data.png" alt="" />
        <p> {{ $t('tip.noProject') }} </p>
      </div>
      <div class="cards-container">
        <div class="row">
          <div class="col-xl-4 col-md-6 mb-4" v-for="(card, idx) of hiveDelegatePools" :key="card.pid + '' + idx">
            <DDelegateCard :card='card'/>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import DDelegateCard from '@/components/Community/DetailInfo/Cards/DHiveDelegateCard'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'DDelegate',
  components: {
    DDelegateCard
  },
  props: {
    hiveDelegatePools: {
      type: Array,
      default: []
    },
  },
  computed: {
    ...mapState({
      hiveAccount: state => state.hive.hiveAccount,
      loadingAllPools: state => state.web3.loadingAllPools
    }),
  },
  methods: {
    ...mapActions('hive', ['getVests', 'getHive'])
  },
  mounted () {
    if(this.hiveAccount && this.hiveAccount.length > 0){
      this.getVests();
      this.getHive();
    }
  },
}
</script>

<style lang="scss" scoped>
</style>
