<template>
  <div class="page-view-content">
    <div class="view-top-header row">
      <div class="col-md-6 text-left">
        <div class="page-back-text-icon page-view-title" @click="$router.push('/community')">{{ $t('community.dashboard') }}</div>
      </div>
      <div class="col-md-6 btn-group">
        <button class="outline-btn" @click="$router.push('/community/community-info')">
          <i class="setting-icon"></i>
          <span>{{ $t('community.setting') }}</span>
        </button>
        <button class="outline-btn" v-show="stakingPools.length > 0">{{ $t('community.updatePools') }}</button>
        <button @click="$router.push('/community/add-pool')">
          <i class="add-icon"></i>
          <span>{{ $t('community.addPool') }}</span>
        </button>
      </div>
    </div>
     <Progress :progress-data="progressData"></Progress>
    <div v-if="stakingPools.length===0"
         class="empty-card d-flex flex-column justify-content-center">
      <div class="empty-bg">
        <img src="~@/static/images/empty-data.png" alt="" />
        <p>{{ $t('community.noPools') }}</p>
      </div>
    </div>
    <template v-else>
      <div class="nav-box" ref="navBox">
        <div class="nav mr-5">
            <span v-for="(item, index) of tabOptions" :key="index"
                  :class="activeTab===index?'active':''"
                  @click="activeTab = index">{{item.name}}</span>
        </div>
      </div>
      <component :is="tabOptions[activeTab].component"></component>
    </template>
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
import Progress from '@/components/Community/Progress'
import CrowdLoanPool from '@/components/Community/StakingPools/CrowdLoanPool'
import { getMyOpenedPools, getMyCommunityInfo, getDistributionEras } from '@/utils/web3/community'
import { handleApiErrCode } from '../../utils/helper'
import { errCode } from '../../config'

export default {
  name: 'PoolsDashboard',
  components: { Progress, CrowdLoanPool },
  data () {
    return {
      activeTab: 0,
      tabOptions: [
        { name: 'Crowdloan', component: 'CrowdLoanPool', chain: '' },
        { name: 'Crowdstaking', component: '', chain: '' },
        { name: 'Delegate', component: '', chain: '' },
        { name: 'Nominate', component: '', chain: '' }
      ],
      stakingPools: [],
      noCommunity: false,
      progressData: [
        { percentage: '10', amount: 200, start: 0, stopHeight: 2000, background: 'rgba(80, 191, 0, 0.3)' },
        // { percentage: '30', amount: 300, start: 2001, stopHeight: 4000, background: 'rgba(80, 191, 0, 0.6)' },
        // { percentage: '50', amount: 400, start: 4001, stopHeight: 2000, background: 'rgba(80, 191, 0, 1)' }
      ]
    }
  },
  methods: {
    gotoCreate () {
      this.$router.push('/community/create-economy')
    }
  },
  async mounted () {
    try{
      getMyCommunityInfo()
      getDistributionEras().then(dist => {
        this.progressData = dist
      }).catch(e => handleApiErrCode(e, (tip, param) => this.$bvToast.toast(tip, param)))
      // const assets = await getRegitryAssets()
      const myPools = await getMyOpenedPools()
      console.log('my pools', myPools);
      this.stakingPools = myPools
    }catch(e){
      if (e === errCode.NO_STAKING_FACTORY){
        this.noCommunity = true;
      }else {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      }
    }
    
  }
}
</script>

<style scoped lang="scss">
.empty-card {
  @include card;
  flex: 1;
}
.view-top-header {
  align-items: center;
  margin-bottom: 2rem;
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
