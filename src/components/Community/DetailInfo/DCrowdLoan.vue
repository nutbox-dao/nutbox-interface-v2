<template>
  <div class="staking-block">
    <div class="loading-bg" v-if="loadingAllPools">
      <img src="~@/static/images/loading.gif" alt="" />
      <p class="font16">{{ $t('tip.loading') }}</p>
    </div>
    <template v-else>
      <div v-if="crowdloanPools.length > 0"></div>
      <div class="empty-bg" v-else>
        <img src="~@/static/images/empty-data.png" alt="" />
        <p> {{ $t('tip.noProject') }} </p>
      </div>
      <div class="cards-container">
        <div class="row">
          <div class="col-xl-4 col-md-6 mb-4" v-for="(card, idx) of crowdloanPools" :key="card.pid + ''  + idx">
            <DLoanCard :card="card"/>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import DLoanCard from '@/components/Community/DetailInfo/Cards/DLoanCard'
import { getAllParachain } from '@/utils/web3/pool'
import { mapState } from 'vuex'
import { sortCRPoolCard } from '@/utils/commen/crowdloan'

export default {
  name: 'DCrowdLoan',
  components: { DLoanCard },
  data () {
    return {
      sortedPools: []
    }
  },
  props: {
    crowdloanPools: {
      type: Array,
      default: []
    }
  },
  computed: {
    ...mapState({
      allParachain: state => state.allParachain,
      loadingAllPools: state => state.web3.loadingAllPools
    }),
    ...mapState('polkadot', ['isConnected', 'crowdstakings']),
    data () {
      const { crowdloanPools, allParachain } = this
      return { crowdloanPools, allParachain }
    },
  },
  watch: {
    data (newValue, oldValue) {
      const { crowdloanPools, allParachain } = newValue
      this.sortedPools = sortCRPoolCard(crowdloanPools, allParachain)
    }
  },
  mounted () {
    // get parachian info from backend
    getAllParachain().then((res) => {
      this.sortedPools = sortCRPoolCard(this.crowdloanPools, this.allParachain)
    }).catch(e => {
    })
  }
}
</script>

<style scoped>

</style>
