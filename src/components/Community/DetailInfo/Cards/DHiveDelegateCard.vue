<template>
  <div class="c-card">
    <div class="card-title-box flex-start-center">
      <div class="card-single-icon mr-2">
        <img class="icon1" src="~@/static/images/hive-logo.png" alt="" />
      </div>
      <div class="card-link-title-text">
        <div class="title-text font20 font-bold link-title">
          <span>{{ card.poolName }}</span>
        </div>
      </div>
    </div>
    <div class="text-left mt-3">
      <span style="color: #717376;" class="font-bold">{{ card.tokenSymbol + ' ' }}</span>
      <span style="color: #BDBFC2">EARNED</span>
    </div>
    <div class="btn-row">
      <span class="value"> {{ pendingReward | amountForm }} </span>
      <div class="right-box">
        <button class="primary-btn m-0">{{ $t('message.withdraw') }}</button>
      </div>
    </div>
    <div class="text-left mt-3 mb-1">
      <span style="color: #717376;" class="font-bold">HIVE POWER</span>
      <span style="color: #BDBFC2"> DELEGATED</span>
    </div>
    <div class="btn-row mb-4" v-if="hiveLogin">
      <span class="value"> {{ (loadingUserStakings ? 0 : staked) | amountForm }} </span>
      <div class="right-box">
        <button class="outline-btn" @click="decrease">-</button>
        <button class="outline-btn" @click="increase">+</button>
      </div>
    </div>
   <ConnectWalletBtn
    class="op-bottom"
    v-if="!hiveLogin"
    type='HIVE'
    @hiveLogin="showHiveLogin = true"
  />
    <div class="detail-info-box">
      <div class="project-info-container">
        <span class="name"> {{ tvl | amountForm }} </span>
        <div class="info">--</div>
      </div>
      <div class="project-info-container">
        <span class="name"> APY </span>
        <div class="info">13.0%</div>
      </div>
    </div>
    <b-modal
      v-model="showModal"
      modal-class="custom-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <DDelegateModal :operate='operate' :card='card' @hideDelegateMask="showModal=false"/>
    </b-modal>
    <Login type='HIVE' v-if="showHiveLogin" @hideMask="showHiveLogin = false" />
  </div>
</template>

<script>
import { vestsToHive } from '@/utils/hive/hive'
import DDelegateModal from '@/components/ToolsComponents/HiveDelegateModal'
import { mapState } from 'vuex'
import ConnectWalletBtn from '@/components/ToolsComponents/ConnectWalletBtn'
import Login from '@/components/ToolsComponents/Login'

export default {
  name: 'DDelegateCard',
  components: {
    DDelegateModal,
    ConnectWalletBtn,
    Login
  },
  props: {
    card: {
      type: Object
    }
  },
  computed: {
    ...mapState('hive', ['hiveAccount', 'vestsToHive']),
    ...mapState('web3', ['pendingRewards', 'userStakings', 'loadingUserStakings', 'totalStakings']),
    hiveLogin() {
      return !!this.hiveAccount
    },
    pendingReward(){
      const pendingBn = this.pendingRewards[this.card.communityId + '-' + this.card.pid]
      if(!pendingBn) return 0;
      const decimal = this.card.tokenDecimal
      return parseFloat(pendingBn.toString() / (10 ** decimal))
    },
    staked(){
      const userStakingBn = this.userStakings[this.card.communityId + '-' + this.card.pid]
      if(!userStakingBn) return 0;
      return this.vestsToHive * (userStakingBn.toString() / 1e6)
    },
    tvl() {
      const tvl = this.totalStakings[this.card.communityId + '-' + this.card.pid]
      if(!tvl) return 0;
      return this.vestsToHive * (tvl.toString() / 1e6)
    }
  },
  data () {
    return {
      showModal: false,
      operate: 'add',
      showHiveLogin: false
    }
  },
  methods: {
    increase() {
      this.operate = 'add'
      this.showModal = true
    },
    decrease(){
      this.operate ='minus'
      this.showModal = true
    }
  },
}
</script>

<style lang="scss" scoped>
@import "src/static/css/card/common-card";
.btn-row {
  @include c-flex-between-center;
  .value {
    font-size: 1.2rem;
    font-weight: bolder;
  }
  .right-box {
    width: 6rem;
    @include c-flex-between-center;
  }
  .outline-btn {
    background-color: white;
    border: 1px solid var(--primary-custom);
    height: 2.4rem;
    width: 2.4rem;
    border-radius: .8rem;
  }
}
</style>
