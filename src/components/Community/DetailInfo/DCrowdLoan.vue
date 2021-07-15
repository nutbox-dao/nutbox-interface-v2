<template>
  <div class="row">
    <div
      class="col-xl-4 col-md-6 mb-4"
      v-for="(crowdloan, idx) of crowdloanInfo"
      :key="idx"
    >
      <ComCRCard :crowdloan="crowdloan" :communityNominatorId='communityNominatorId' chain="kusama"/>
    </div>
  </div>
</template>

<script>
import CrowdloanCard from '@/components/Crowdloan/CrowdloanCard'
import { mapGetters, mapState } from 'vuex'
import { stanfiAddress } from '@/utils/commen/account'
import { getOnshowingCrowdloanCard as getOnshowingComCRCard } from '@/apis/api'
import { loadFunds } from '@/utils/kusama/crowdloan'
import ComCRCard from '@/components/Crowdloan/ComCRCard'

export default {
  name: 'DCrowdLoan',
  components: { ComCRCard },
  props: {},
  data () {
    return {
      communityNominatorId: null
    }
  },
  computed: {
    ...mapState('kusama', ['showingCrowdloan']),
    ...mapGetters('kusama', ['showingCard']),
    ...mapState(['lang']),
    crowdloanInfo () {
      const id = stanfiAddress(this.$route.query.id || '15VdT2AoEvdwjLtevCipjdYYj32kN8HZLjJtR8U3EXSQXRZL')
      if (this.showingCard && this.showingCard.length > 0) {
        return this.showingCard.filter(
          (a) => stanfiAddress(a.community.communityId) === id
        )
      }
      return []
    },
    communityInfo () {
      return this.crowdloanInfo.length > 0 && this.crowdloanInfo[0].community
    }
  },
  mounted () {
    const nominator = stanfiAddress(this.$route.params.nominatorId)
    if (nominator) {
      this.communityNominatorId = nominator
    }
  },
  async created () {
    // if (this.communityInfo) return
    // const res = await getOnshowingComCRCard({ relaychain: 'kusama' })
    // loadFunds(res)
  }
}
</script>

<style scoped>

</style>
