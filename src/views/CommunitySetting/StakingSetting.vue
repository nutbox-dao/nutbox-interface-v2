<template>
  <div class="container scroll-content">
    <div class="view-top-header flex-between-center">
      <div class="page-title-line font20 font-bold">{{ $t('community.pool') }}</div>
      <div class="c-btn-group" >
        <button class="outline-btn"
                v-show="stakingPools.length > 1"
                @click="$router.push('/community-setting/update-pool')">{{ $t('community.updatePools') }}</button>
        <button @click="$router.push('/community-setting/add-pool')">
          <i class="add-icon"></i>
          <span>{{ $t('community.addPool') }}</span>
        </button>
      </div>
    </div>
    <div v-if="stakingPools && stakingPools.length===0"
         class="empty-card mb-5 d-flex flex-column justify-content-center">
      <div class="empty-bg">
        <img src="~@/static/images/empty-data.png" alt="" />
        <p>{{ $t('community.noPools') }}</p>
      </div>
    </div>
    <template v-else>
      <div class="row">
        <div class="col-xl-4 col-md-6 mb-4" v-for="pool of stakingPools" :key="pool.pid">
          <DashboardPoolCard :pool="pool"/>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import DashboardPoolCard from '@/components/Community/DashboardPoolsCard/DashboardPoolCard'
import { getDistributionEras, getMyCommunityInfo } from '@/utils/web3/community'
import { handleApiErrCode } from '@/utils/helper'
import { getMyOpenedPools } from '@/utils/web3/pool'
import { errCode } from '@/config'

export default {
  name: 'StakingSetting',
  components: { DashboardPoolCard },
  data () {
    return {
      stakingPools: []
    }
  },
  async mounted () {
    try {
      this.loadingPool = true
      await getMyCommunityInfo()
      getDistributionEras().then(dist => {
        this.progressData = dist
      }).catch(e => handleApiErrCode(e, (tip, param) => this.$bvToast.toast(tip, param)))
      // const assets = await getRegitryAssets()
      const myPools = await getMyOpenedPools()
      console.log('my pools', myPools)
      this.stakingPools = [...myPools]
      this.stakingPools.reverse()
    } catch (e) {
      if (e === errCode.NO_STAKING_FACTORY) {
        this.noCommunity = true
      } else {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      }
    } finally {
      this.loadingPool = false
    }
  }
}
</script>

<style scoped>

</style>
