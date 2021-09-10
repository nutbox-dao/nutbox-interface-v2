<template>
  <div class="k-page crowdstaking-page">
    <div class="loading-bg" v-if="loadingAllPools">
      <img src="~@/static/images/loading.gif" alt="" />
      <p class="font16">{{ $t('tip.loading') }}</p>
    </div>
    <template v-else>
      <div v-if="sortedPools.length > 0"></div>
      <div class="empty-bg" v-else>
        <img src="~@/static/images/empty-data.png" alt="" />
        <p> {{ $t('tip.noProject') }} </p>
      </div>
      <div class="cards-container">
        <div class="row">
          <div class="col-xl-4 col-md-6 mb-4" v-for="(pool, idx) of sortedPools" :key="idx.toString()+pool.trieIndex">
            <CrowdLoanCard :card="pool"/>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import CrowdLoanCard from '@/components/CrowdStaking/CrowdLoanCard'
import { getAllParachain } from '@/utils/web3/pool'
import { mapState, mapGetters } from 'vuex'
import { sortCRPoolCard } from '@/utils/commen/crowdloan'

export default {
  name: 'DCrowdLoan',
  components: { CrowdLoanCard },
  data () {
    return {
      sortedPools: []
    }
  },
  computed: {
    ...mapState({
      allParachain: state => state.allParachain,
      loadingAllPools: state => state.web3.loadingAllPools
    }),
    ...mapGetters('web3', ['poolCards']),
    data () {
      const { poolCards, allParachain } = this
      return { poolCards, allParachain }
    }
  },
  watch: {
    data (newValue, oldValue) {
      const { poolCards, allParachain } = newValue
      this.sortedPools = sortCRPoolCard(poolCards, allParachain)
    }
  },
  mounted () {
    // get parachian info from backend
    getAllParachain().then((res) => {
      this.sortedPools = sortCRPoolCard(this.poolCards, this.allParachain)
    }).catch(e => {
      console.log(e);
    })
  }
}
</script>

<style scoped>

</style>
