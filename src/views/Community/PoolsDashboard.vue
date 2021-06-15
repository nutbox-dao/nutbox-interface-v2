<template>
  <div class="page-view-content">
    <div class="view-top-header row">
      <div class="col-md-6 text-left">
        <div class="page-back-text-icon page-view-title" @click="$router.back()">Your Staking pools</div>
      </div>
      <div class="col-md-6 btn-group">
        <button>Update Pool Rations</button>
        <button @click="$router.push('/community/add-pool')">
          <i class="add-icon"></i>
          <span>Add Pool</span>
        </button>
      </div>
    </div>
    <div class="scroll-content">
      <Progress :min="progressData[0].start" max="Max" :progress-data="progressData"></Progress>
      <div class="row">
        <div class="col-xl-4 col-md-6 mb-4" v-for="i of 3" :key="i">
          <StakePoolCard/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StakePoolCard from '@/components/Community/StakePoolCard'
import Progress from '@/components/Community/Progress'
export default {
  name: 'PoolsDashboard',
  components: { StakePoolCard, Progress },
  data () {
    return {
      progressData: [
        { percentage: '10', value: 200, start: 1001, end: 2000, background: 'rgba(80, 191, 0, 0.3)' },
        { percentage: '30', value: 300, start: 2001, end: 4000, background: 'rgba(80, 191, 0, 0.6)' },
        { percentage: '50', value: 400, start: 4001, end: 2000, background: 'rgba(80, 191, 0, 1)' }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.view-top-header {
  align-items: center;
  margin-bottom: 2rem;
}
.scroll-content {
  padding-top: .5rem;
}
.c-progress {
  margin-top: 4rem;
  margin-bottom: 3.5rem;
}
</style>
