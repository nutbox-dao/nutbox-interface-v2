<template>
  <div class="page-view-content">
    <div class="view-top-header row">
      <div class="col-md-6 text-left">
        <div class="page-back-text-icon page-view-title" @click="$router.back()">Your Staking pools</div>
      </div>
      <div class="col-md-6 btn-group">
        <button class="outline-btn" @click="$router.push('/community/community-info')">
          <i class="setting-icon"></i>
          <span>Setting</span>
        </button>
        <button class="outline-btn" v-show="stakingPools.length > 0">Update Pool Rations</button>
        <button @click="$router.push('/community/add-pool')">
          <i class="add-icon"></i>
          <span>Add Pool</span>
        </button>
      </div>
    </div>
    <div class="scroll-content">
      <div v-if="stakingPools.length===0"
           class="empty-card d-flex flex-column justify-content-center">
        <div class="empty-bg">
          <img src="~@/static/images/empty-data.png" alt="" />
          <p>No ongoing auction</p>
        </div>
      </div>
      <template v-else>
        <Progress :min="progressData[0].start" max="Max" :progress-data="progressData"></Progress>
        <div class="row">
          <div class="col-xl-4 col-md-6 mb-4" v-for="i of 3" :key="i">
            <StakePoolCard/>
          </div>
        </div>
      </template>
    </div>
        <b-modal
      v-model="noCommunity"
      modal-class="custom-modal"
      size="sm"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <div class="tip-modal">
        <div class="font20 font-bold text-center my-5">
          {{ $t('community.noCommunity') }}
        </div>
        <button class="primary-btn" @click="gotoCreate">
          {{ $t('community.gotoCreate') }}
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import StakePoolCard from '@/components/Community/StakePoolCard'
import Progress from '@/components/Community/Progress'
import { getRegitryAssets } from '@/utils/web3/asset'

export default {
  name: 'PoolsDashboard',
  components: { StakePoolCard, Progress },
  data () {
    return {
      stakingPools: [],
      noCommunity:false,
      progressData: [
        { percentage: '10', value: 200, start: 1001, end: 2000, background: 'rgba(80, 191, 0, 0.3)' },
        { percentage: '30', value: 300, start: 2001, end: 4000, background: 'rgba(80, 191, 0, 0.6)' },
        { percentage: '50', value: 400, start: 4001, end: 2000, background: 'rgba(80, 191, 0, 1)' }
      ]
    }
  },
  methods: {
    gotoCreate() {
      this.$router.push("/community/create-economy");
    },
  },
  async mounted () {
    const assets = await getRegitryAssets()
  },
}
</script>

<style scoped lang="scss">
.empty-card {
  @include card
}
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
.setting-icon {
  @include icon;
  min-width: 1rem;
  margin-right: .2rem;
  background-image: url("~@/static/images/setting-icon.svg");
}
</style>
