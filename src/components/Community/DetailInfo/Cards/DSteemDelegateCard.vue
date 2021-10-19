<template>
  <div class="c-card">
    <div class="status-container text-right">
      <span v-if="status === 'Active'" :class="'Active'">{{ $t('community.'+status) }}</span>
      <span v-else class="Completed">{{ $t('community.'+status) }}</span>
    </div>
    <div class="card-title-box flex-start-center">
      <div class="card-single-icon mr-2">
        <img class="icon1" src="~@/static/images/tokens/steem.png" alt="" />
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
        <button :disabled="isWithdrawing" class="primary-btn m-0" @click="withdraw">
          <b-spinner small type="grow" v-show="isWithdrawing"></b-spinner>
          {{ $t("commen.withdraw") }}
        </button>
      </div>
    </div>
    <div class="text-left mt-3 mb-1">
      <span style="color: #717376;" class="font-bold">STEEM POWER</span>
      <span style="color: #BDBFC2"> DELEGATED</span>
    </div>
     <button
        class="primary-btn" :disabled='true' v-if="!!countDown">
        {{ countDown }}
    </button>
    <template v-else>
      <div class="btn-row mb-4" v-if="steemLogin">
        <span class="value"> {{ (loadingUserStakings ? 0 : staked) | amountForm }} </span>
        <div class="right-box">
          <button class="outline-btn" @click="decrease">-</button>
          <button class="outline-btn" :disabled="status !== 'Active'" @click="increase">+</button>
        </div>
      </div>
      <ConnectWalletBtn
      class="op-bottom"
      v-if="!steemLogin"
      type='STEEM'
      @steemLogin="showSteemLogin = true"
      />
    </template>
    <div class="detail-info-box">
      <div class="project-info-container">
        <span class="name"> {{ $t('community.totalDeposit') }} </span>
        <div class="info">{{ totalDeposited | amountForm }}</div>
      </div>
      <div class="project-info-container">
        <span class="name"> TVL </span>
        <div class="info">{{ tvl | formatPrice }}</div>
      </div>
      <div class="project-info-container">
        <span class="name"> APY </span>
        <div class="info">{{ card.apy ? card.apy.toFixed(2) + '%' : '--' }}</div>
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
      <DelegateModal :operate='operate' :card='card' @hideDelegateMask="showModal=false"/>
    </b-modal>
    <Login type='STEEM' v-if="showSteemLogin" @hideMask="showSteemLogin = false" />
  </div>
</template>

<script>
import DelegateModal from '@/components/ToolsComponents/SteemDelegateModal'
import { mapState } from 'vuex'
import ConnectWalletBtn from '@/components/ToolsComponents/ConnectWalletBtn'
import Login from '@/components/ToolsComponents/Login'
import { formatCountdown } from '@/utils/helper'
import { handleApiErrCode } from '@/utils/helper'
import { withdrawReward } from '@/utils/web3/pool'
import { BLOCK_SECOND } from '@/constant'

export default {
  name: 'DDelegateCard',
  components: {
    DelegateModal,
    ConnectWalletBtn,
    Login
  },
  props: {
    card: {
      type: Object
    }
  },
  computed: {
    ...mapState('steem', ['steemAccount', 'vestsToSteem']),
    ...mapState(['prices']),
    ...mapState('web3',['pendingRewards','userStakings', 'loadingUserStakings', 'monitorPools', 'blockNum']),
    pendingReward(){
      const pendingBn = this.pendingRewards[this.card.communityId + '-' + this.card.pid]
      if(!pendingBn) return 0;
      const decimal = this.card.tokenDecimal
      return parseFloat(pendingBn.toString() / (10 ** decimal))
    },
    steemLogin() {
      return !!this.steemAccount
    },
    staked(){
      const userStakingBn = this.userStakings[this.card.communityId + '-' + this.card.pid]
      if(!userStakingBn) return 0;
      return this.vestsToSteem * (this.userStakings[this.card.communityId + '-' + this.card.pid].toString() / 1e6)
    },
    totalDeposited() {
      if (!this.card || !this.monitorPools[this.card.communityId + '-' + this.card.pid + '-totalStakedAmount']) return 0;
      return this.card && this.monitorPools[this.card.communityId + '-' + this.card.pid + '-totalStakedAmount'] * this.vestsToSteem / 1e6
    },
    tvl() {
      return this.totalDeposited * this.prices['STEEMETH']
    },
    countDown() {
      if (!this.card?.firstBlock) return;
      return formatCountdown(this.card.firstBlock, this.blockNum, BLOCK_SECOND)
    },
    status (){
      const canRemove = this.monitorPools[this.card.communityId + '-' + this.card.pid + '-canRemove']
      const hasRemoved = this.monitorPools[this.card.communityId + '-' + this.card.pid + '-hasRemoved']
      const hasStopped = this.monitorPools[this.card.communityId + '-' + this.card.pid + '-hasStopped']
      if(!hasStopped){
        return 'Active'
      }else if (!canRemove){
        return 'Stopped'
      }else{
        if (hasRemoved){
          return 'Removed'
        }else{
          return 'CanRemove'
        }
      }
    }
  },
  data () {
    return {
      showModal: false,
      operate: 'add',
      showSteemLogin: false,
      isWithdrawing:false
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
    },
    async withdraw() {
      try{
        this.isWithdrawing = true
        await withdrawReward(this.card.communityId, this.card.pid)
        this.$bvToast.toast(this.$t('tip.withdrawSuccess'), {
          title: this.$t('tip.success'),
          variant: "success"
        })
      }catch(e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      }finally{
        this.isWithdrawing = false  
      }
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
