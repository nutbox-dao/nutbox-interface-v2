<template>
  <div class="row">
    <div class="loading-bg" v-if="loading">
      <img src="~@/static/images/loading.gif" alt="" />
      <p class="font16">{{ $t("tip.loading") }}</p>
    </div>
    <div
      v-else
      class="col-xl-4 col-md-6 mb-4"
      v-for="(pool, idx) of crowdloanPools"
      :key="idx"
    >
      <ComCRCard :crowdloan="pool"/>
    </div>
  </div>
</template>

<script>
import ComCRCard from '@/components/Crowdloan/ComCRCard'
import { getOnshowingCrowdloanCard } from '@/apis/api'
import { loadFunds as loadKusamaFunds } from '@/utils/kusama/crowdloan'
import { loadFunds as loadPolkadotFunds } from '@/utils/polkadot/crowdloan'
import { getAllParachain } from '@/utils/web3/pool'
import { mapState } from 'vuex'

export default {
  name: 'DCrowdLoan',
  components: { ComCRCard },
  data() {
    return {
      loading: true
    }
  },
  props: {
    crowdloanPools:{
      type: Array
    }
  },
  mounted () {
    getAllParachain().then(() => {
      this.loading = false
    }).catch(e => {
      this.loading = false
      
    })
  },
}
</script>

<style scoped>

</style>
