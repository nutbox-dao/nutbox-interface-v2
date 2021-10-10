<template>
  <div class="multi-card">
    <div class="card-link-top-box">
      <div class="flex-start-center">
        <div class="card-link-icons">
          <img class="icon1" :src="card.communityIcon" alt="" />
          <img class="icon2" :src="card.icon" alt="" />
        </div>
        <div class="card-link-title-text font20 font-bold">
          <div
            class="link-title"
            @click="
              $router.push('/community/detail-info?id=' + card.communityId)
            "
          >
            <span>{{ card.communityName }}</span>
            <i class="link-icon"></i>
          </div>
          <div class="link-title">
            <span>{{ card.poolName }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="c-card">
      <div class="text-left mt-3">
        <span style="color: #717376" class="font-bold">{{
          card.tokenSymbol + " "
        }}</span>
        <span style="color: #bdbfc2">EARNED</span>
      </div>
      <div class="btn-row">
        <span class="value"> {{ pendingReward | amountForm }} </span>
        <div class="right-box">
          <button class="primary-btn m-0" :disabled="!approved || isWithdrawing" @click="withdraw">
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
      <template v-else>
        <div class="btn-row mb-4" v-if="approved">
          <span class="value">
            {{ (loadingUserStakings ? 0 : staked) | amountForm }}
          </span>
          <div class="right-box">
            <button class="outline-btn" @click="decrease">-</button>
            <button class="outline-btn" @click="increase">+</button>
          </div>
        </div>
        <template v-else>
          <b-button
            variant="primary"
            @click="approve"
            :disabled="isApproving || loadingApprovements"
          >
            <b-spinner
              small
              type="grow"
              v-show="isApproving || loadingApprovements"
            ></b-spinner>
            {{ $t("commen.approveContract") }}
          </b-button>
        </template>
      </template>
      <div class="detail-info-box">
        <div class="project-info-container">
          <span class="name"> TVL </span>
          <div class="info">{{ tvl | amountForm }}</div>
        </div>
        <div class="project-info-container">
          <span class="name"> APY </span>
          <div class="info">{{ card.apy.toFixed(2) }}%</div>
        </div>
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
import { handleApiErrCode } from "@/utils/helper";
import ConnectMetaMask from '@/components/Commen/ConnectMetaMask'

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
    ...mapState("web3", [
      "pendingRewards",
      "approvements",
      "loadingApprovements",
      "userStakings",
      "loadingUserStakings",
      "totalStakings"
    ]),
    ...mapState(['metamaskConnected']),
    pendingReward() {
      const pendingBn =
        this.pendingRewards[this.card.communityId + "-" + this.card.pid];
      if (!pendingBn) return 0;
      const decimal = this.card.tokenDecimal;
      return parseFloat(pendingBn.toString() / 10 ** decimal).toFixed(3);
    },
    approved() {
      return this.approvements[this.card.communityId + "-" + this.card.pid];
    },
    staked() {
      const userStakingBn =
        this.userStakings[this.card.communityId + "-" + this.card.pid];
      if (!userStakingBn) return 0;
      const decimal = this.card.decimal;
      return parseFloat(userStakingBn.toString() / 10 ** decimal);
    },
    tvl() {
      const tvl = this.totalStakings[this.card.communityId + '-' + this.card.pid]
      if(!tvl) return 0;
      const decimal = this.card.decimal
      return (tvl.toString() / (10 ** decimal))
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
      }catch(e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      }finally{
        this.isWithdrawing = false  
      }
    }
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
