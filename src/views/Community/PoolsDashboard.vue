<template>
  <div class="page-view-content">
    <div class="view-top-header row">
      <div class="col-md-6 text-left">
        <div class="page-back-text-icon page-view-title" @click="$router.push('/community')">Your Staking pools</div>
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
<!--      <div v-if="stakingPools.length===0"-->
<!--           class="empty-card d-flex flex-column justify-content-center">-->
<!--        <div class="empty-bg">-->
<!--          <img src="~@/static/images/empty-data.png" alt="" />-->
<!--          <p>No ongoing auction</p>-->
<!--        </div>-->
<!--      </div>-->
      <template >
        <div class="nav-box">
          <div class="nav mr-5">
            <span v-for="(item, index) of tabOptions" :key="index"
                  :class="activeTab===index?'active':''"
                  @click="activeTab = index">{{item.name}}</span>
          </div>
        </div>
        <component :is="tabOptions[activeTab].component"></component>
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
import CrowdLoanPool from '@/components/Community/StakingPools/CrowdLoanPool'
import { getMyOpenedPools } from '@/utils/web3/community'

export default {
  name: 'PoolsDashboard',
  components: { CrowdLoanPool },
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
      noCommunity: false
    }
  },
  methods: {
    gotoCreate () {
      this.$router.push('/community/create-economy')
    }
  },
  async mounted () {
    // const assets = await getRegitryAssets()
    const myPools = await getMyOpenedPools()
    
  }
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
.setting-icon {
  @include icon;
  min-width: 1rem;
  margin-right: .2rem;
  background-image: url("~@/static/images/setting-icon.svg");
}
</style>
