<template>
  <div class="k-page crowdstaking-page">
    <div class="loading-bg" v-if="loading">
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
          <div class="col-xl-4 col-md-6 mb-4" v-for="(pool, idx) of sortedPools" :key="idx">
            <CrowdLoanCard :crowdloan="pool"/>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import CrowdLoanCard from '@/components/CrowdStaking/CrowdLoanCard'
import { getAllParachain } from '@/utils/web3/pool'
import { mapState } from 'vuex'
import { sortPoolCard } from '@/utils/commen/crowdloan'

export default {
  name: 'DCrowdLoan',
  components: { CrowdLoanCard },
  data () {
    return {
      loading: true,
      sortedPools: []
    }
  },
  props: {
    crowdloanPools: {
      type: Array
    }
  },
  computed: {
    ...mapState({
      allParachain: state => state.allParachain
    }),
    data () {
      const { crowdloanPools, allParachain } = this
      return { crowdloanPools, allParachain }
    }
  },
  watch: {
    data (newValue, oldValue) {
      const { crowdloanPools, allParachain } = newValue
      this.sortPoolCard = sortPoolCard(crowdloanPools, allParachain)
    }
  },
  mounted () {
    // get parachian info from backend
    getAllParachain().then((res) => {
      this.sortedPools = sortPoolCard(this.crowdloanPools, this.allParachain)
      this.loading = false
    }).catch(e => {
      this.loading = false
    })
  }
}
</script>

<style scoped>

</style>
