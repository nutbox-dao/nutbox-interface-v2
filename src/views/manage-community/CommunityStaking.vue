<template>
  <div class="scroll-content">
    <div class="container">
      <div class="view-top-header flex-between-center">
        <div class="c-btn-group" >
          <button class="primary-btn primary-btn-outline w-auto mr-2"
                  @click="$router.push('/community-setting/update-pool')">
            {{ $t('pool.updatePoolRatios') }}</button>
          <button class="primary-btn w-auto mx-0 d-flex align-items-center"
                  @click="$router.push('/community-setting/add-pool')">
            <i class="add-icon"></i>
            <span>{{ $t('pool.addPool') }}</span>
          </button>
        </div>
      </div>
      <div class="view-top-header view-top-header-sticky">
        <div class="row">
          <div class="col-md-6">
            <div class="nav-box nav-box-bg mb-3 mb-md-0">
              <div class="nav">
                <span v-for="(item, index) of tabOptions" :key="index"
                      :class="activeTab===index?'active':''"
                      @click="activeTab = index">{{item}}</span>
              </div>
            </div>
          </div>
          <div class="col-md-6 text-right">
            <button class="primary-btn w-auto" style="height: 2rem">Inactive Pool</button>
          </div>
        </div>
      </div>
      <div v-if="stakingPools && stakingPools.length===0"
          class="empty-card mb-5 d-flex flex-column justify-content-center">
        <div class="empty-bg">
          <img src="~@/static/images/empty-data.png" alt="" />
          <p>{{ $t('pool.noPools') }}</p>
        </div>
      </div>
      <template v-else>
        <div class="row">
          <div class="col-xl-4 col-md-6 mb-4" v-for="pool of stakingPools" :key="pool.pid">
            <ManageStakingCard :pool="pool"/>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import ManageStakingCard from '@/components/community/ManageStakingCard'
import { getDistributionEras, getMyCommunityInfo } from '@/utils/web3/community'
import { handleApiErrCode } from '@/utils/helper'
import { getMyOpenedPools } from '@/utils/web3/pool'
import { CHAIN_NAME, errCode } from '@/config'

export default {
  name: 'CommunitySetting',
  components: { ManageStakingCard },
  data () {
    return {
      stakingPools: [],
      tabOptions: ['All', 'Polkadot', 'Steem', 'Hive'],
      activeTab: 0
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
    } finally {
      this.loadingPool = false
    }
  }
}
</script>

<style scoped>

</style>
