<template>
  <div class="c-card">
    <div class="status-container text-right">
      <span v-if="status === 'Active'" :class="'Active'">{{ $t('community.'+status) }}</span>
      <span v-else class="Completed">{{ $t('community.'+status) }}</span>
    </div>
    <div class="card-title-box flex-start-center">
      <div class="card-single-icon mr-2">
        <img class="icon1" :src="card.icon" alt="" />
      </div>
      <div class="card-link-title-text">
        <div class="title-text font20 font-bold link-title">
          <span>{{ card.poolName }}</span>
        </div>
      </div>
    </div>
    <div class="text-left mt-3">
      <span style="color: #717376" class="font-bold">{{
        card.tokenSymbol + " "
      }}</span>
      <span style="color: #bdbfc2">EARNED</span>
    </div>
    <div class="btn-row">
      <span class="value"> {{ pendingReward | amountForm }} </span>
      <div class="right-box">
        <button :disabled="!approved || isWithdrawing" class="primary-btn m-0" @click="withdraw">
          <b-spinner small type="grow" v-show="isWithdrawing"></b-spinner>
          {{ $t("commen.withdraw") }}
        </button>
      </div>
    </div>
    <div class="text-left mt-3 mb-1">
      <span style="color: #717376" class="font-bold">{{ card.symbol }}</span>
      <span style="color: #bdbfc2"> STAKED</span>
    </div>
    <ConnectMetaMask v-if="!metamaskConnected"/>
    <template  v-else>
    <div class="btn-row mb-4" v-if="approved">
      <span class="value">
        {{ (loadingUserStakings ? 0 : staked) | amountForm }}
      </span>
      <div class="right-box">
        <button class="outline-btn" @click="decrease">-</button>
        <button class="outline-btn" :disabled="status !== 'Active'" @click="increase">+</button>
      </div>
    </div>
    <template v-else>
      <button class="primary-btn" v-if="!!countDown" :disabled='true'>
        {{ countDown }}
      </button>
      <button
      v-else
        class="primary-btn"
        @click="approve"
        :disabled="isApproving || loadingApprovements || status !== 'Active'"
      >
        <b-spinner
          small
          type="grow"
          v-show="isApproving || loadingApprovements"
        ></b-spinner>
        {{ $t("commen.approveContract") }}
      </button>
    </template>
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
      <StakingHomeChainAssetModal
        :operate="operate"
        :card="card"
        @hideStakeMask="showModal = false"
      />
    </b-modal>
  </div>
</template>

<script>
import StakingHomeChainAssetModal from "@/components/ToolsComponents/StakingHomeChainAssetModal";
import { mapState } from "vuex";
import { approvePool, withdrawReward } from "@/utils/web3/pool";
import { handleApiErrCode, formatCountdown } from "@/utils/helper";
import ConnectMetaMask from '@/components/Commen/ConnectMetaMask'
import { BLOCK_SECOND } from '@/constant'

export default {
  name: "DDelegateCard",
  components: {
    StakingHomeChainAssetModal,
    ConnectMetaMask
  },
  props: {
    card: {
      type: Object,
    },
  },
  computed: {
    ...mapState("steem", ["steemAccount"]),
    ...mapState(['metamaskConnected', 'prices']),
    ...mapState("web3", [
      "pendingRewards",
      "approvements",
      "loadingApprovements",
      "userStakings",
      'allTokens',
      "loadingUserStakings",
      "monitorPools",
      "blockNum"
    ]),
    pendingReward() {
      const pendingBn =
        this.pendingRewards[this.card.communityId + "-" + this.card.pid];
      if (!pendingBn) return 0;
      const decimal = this.card.tokenDecimal;
      return parseFloat(pendingBn.toString() / (10 ** decimal));
    },
    approved() {
      return this.approvements[this.card.communityId + "-" + this.card.pid];
    },
    staked() {
      const userStakingBn =
        this.userStakings[this.card.communityId + "-" + this.card.pid];
      if (!userStakingBn) return 0;
      const decimal = this.card.decimal;
      return parseFloat(userStakingBn.toString() / (10 ** decimal));
    },
    totalDeposited() {
      if (!this.card || !this.monitorPools[this.card.communityId + '-' + this.card.pid + '-totalStakedAmount']) return 0;
      const tvl = this.card && this.monitorPools[this.card.communityId + '-' + this.card.pid + '-totalStakedAmount'];
      if(!tvl) return 0;
      const decimal = this.card.decimal
      return (tvl.toString() / (10 ** decimal))
    },
    tvl() {
      return this.totalDeposited * this.erc20Price
    },
    erc20Price(){
      if (!this.card) return null;
      return this.allTokens.filter(token => token.address === this.card.address)[0].price
    },
    //if community not start, show count down time
    countDown () {
      if (!this.card?.firstBlock){
        return null;
      }
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
  data() {
    return {
      showModal: false,
      operate: "add",
      isApproving: false,
      isWithdrawing: false
    };
  },
  methods: {
    increase() {
      this.operate = "add";
      this.showModal = true;
    },
    decrease() {
      this.operate = "minus";
      this.showModal = true;
    },
    // Approve contract
    async approve() {
      try {
        this.isApproving = true;
        const hash = await approvePool(this.card);
        this.$bvToast.toast(this.$t("tip.approveSuccess"), {
          title: this.$t("tip.success"),
          variant: "success",
        });
      } catch (e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param);
        });
      } finally {
        this.isApproving = false;
      }
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
  mounted() {
  },
};
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
    border-radius: 0.8rem;
  }
}
</style>
