<template>
  <div class="scroll-content">
    <div class="container">
      <div class="view-top-header flex-between-center">
        <div class="c-btn-group" >
          <button class="primary-btn primary-btn-outline w-auto mr-2"
                  @click="configPoolModal=true">
            {{ $t('community.updatePools') }}</button>
          <button class="primary-btn w-auto mx-0 d-flex align-items-center"
                  @click="poolTypeModal=true, createPoolStep=1">
            <i class="add-icon"></i>
            <span>{{ $t('community.addPool') }}</span>
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
          <p>{{ $t('community.noPools') }}</p>
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
    <b-modal
      v-model="poolTypeModal"
      modal-class="custom-modal"
      size="lg"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop>
      <StakingPoolType v-show="createPoolStep===1"
                            @close="poolTypeModal=false"
                            @onType="selectPoolType"/>
      <div v-show="createPoolStep===2">
        <StakingBSCPool v-if="poolType==='bsc'"
                        @confirm="selectPoolToken"
                        @back="createPoolStep=1"/>
        <StakingDelegatePool v-else :delegate-type="poolType"
                             @confirm="selectPoolToken"
                             @back="createPoolStep=1"/>
      </div>
      <StakingPoolConfig v-if="createPoolStep===3"
                         @back="createPoolStep=2"
                         @close="poolTypeModal=false"/>
    </b-modal>
    <b-modal
      v-model="configPoolModal"
      modal-class="custom-modal"
      size="lg"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop>
      <StakingPoolConfig :enable-back="false"
                         :form="{assetId: '',name: '',ratios: []}"
                         :my-pools="[]"
                         @close="configPoolModal=false"/>
    </b-modal>
  </div>
</template>

<script>
import ManageStakingCard from '@/components/community/ManageStakingCard'
import { getDistributionEras, getMyCommunityInfo } from '@/utils/web3/community'
import { handleApiErrCode } from '@/utils/helper'
import { getMyOpenedPools } from '@/utils/web3/pool'
import { CHAIN_NAME, errCode } from '@/config'
import StakingPoolType from '@/components/community/StakingPoolType'
import StakingBSCPool from '@/components/community/StakingBSCPool'
import StakingDelegatePool from '@/components/community/StakingDelegatePool'
import StakingPoolConfig from '@/components/community/StakingPoolConfig'

export default {
  name: 'CommunitySetting',
  components: { ManageStakingCard, StakingPoolType, StakingBSCPool, StakingDelegatePool, StakingPoolConfig },
  data () {
    return {
      stakingPools: [],
      tabOptions: ['All', 'Polkadot', 'Steem', 'Hive'],
      activeTab: 0,
      poolTypeModal: false,
      createPoolStep: 1,
      poolType: '',
      configPoolModal: false
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
  },
  methods: {
    selectPoolType (type) {
      this.poolType = type
      this.createPoolStep = 2
    },
    selectPoolToken (tokenData) {
      this.createPoolStep = 3
    }
  }
}
</script>

<style scoped>

</style>
