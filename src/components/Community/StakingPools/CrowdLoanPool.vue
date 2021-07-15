<template>
  <div>
    <div class="row">
      <div class="col-xl-4 col-md-6 mb-4" v-for="i of 3" :key="i">
        <StakePoolCard/>
      </div>
    </div>
  </div>
</template>

<script>
import StakePoolCard from '@/components/Community/PoolsCard/StakePoolCard'

export default {
  name: 'CrowdLoanPool',
  components: { StakePoolCard },
  data () {
    return {
      progressData: [
        { percentage: '10', amount: 200, start: 1001, stopHeight: 2000, background: 'rgba(80, 191, 0, 0.3)' },
        { percentage: '30', amount: 300, start: 2001, stopHeight: 4000, background: 'rgba(80, 191, 0, 0.6)' },
        { percentage: '50', amount: 400, start: 4001, stopHeight: 2000, background: 'rgba(80, 191, 0, 1)' }
      ]
    }
  }
}
</script>

<style scoped lang="scss">

</style>
