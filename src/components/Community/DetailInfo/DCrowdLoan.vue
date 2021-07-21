<template>
  <div class="row">
    <div class="loading-bg" v-if="loading">
      <img src="~@/static/images/loading.gif" alt="" />
      <p class="font16">{{ $t("tip.loading") }}</p>
    </div>
    <div
      v-else
      class="col-xl-4 col-md-6 mb-4"
      v-for="(pool, idx) of sortedPools"
      :key="idx"
    >
      <CrowdloanCard :crowdloan="pool"/>
    </div>
  </div>
</template>

<script>
import CrowdloanCard from '@/components/Crowdloan/CrowdloanCard'
import { getAllParachain } from '@/utils/web3/pool'
import { mapState } from 'vuex'
import { sortPoolCard } from '@/utils/commen/crowdloan'

export default {
  name: 'DCrowdLoan',
  components: { CrowdloanCard },
  data() {
    return {
      loading: true,
      sortedPools:[],
    }
  },
  props: {
    crowdloanPools:{
      type: Array
    }
  },
  computed: {
    ...mapState({
      allParachain: state => state.allParachain
    }),
    data (){
      const { crowdloanPools, allParachain } = this
      return { crowdloanPools, allParachain }
    }
  },
  watch: {
    data(newValue, oldValue) {
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
  },
}
</script>

<style scoped>

</style>
