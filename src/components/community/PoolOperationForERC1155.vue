<template>
  <div>
    <ConnectMetaMask class="w-100"
      :disable="card.status === 'CLOSED'"
      v-if="!metamaskConnected"
    />
    <template v-else>
      <div
        class="d-flex justify-content-between align-items-center "
        v-if="approved && (!takeFee || approvedCommunity) && !needLogin"
      >
        <span class="value flex-fill">
          {{ staked | amountForm }}
        </span>
        <div class="d-flex">
          <!-- decrease -->
          <button
            class="symbol-btn symbol-btn-outline hover mr-2"
            @click="decrease"
          >
            <i v-if="isCheckingAccount" class="loading-icon-gray"></i>
            <i v-else class="sub-icon sub-icon-primary"></i>
          </button>
          <!-- increase -->
          <button
            class="symbol-btn symbol-btn-outline hover"
            :disabled="card.status === 'CLOSED'"
            @click="increase"
          >
            <i v-if="isCheckingAccount" class="loading-icon-gray"></i>
            <i v-else class="add-icon add-icon-primary"></i>
          </button>
        </div>
      </div>
      <template v-else>
        <!-- approve community -->
        <button
          v-if="takeFee && (loadingApproveCommunity || !approvedCommunity)"
          class="primary-btn"
          @click="approveCommunity"
          :disabled="loadingApproveCommunity || isApprovingCommunity || card.status === 'CLOSED'"
        >
          <b-spinner
            small
            type="grow"
            v-show="isApprovingCommunity || loadingApproveCommunity"
          ></b-spinner>
          {{ $t("operation.approveCommunity") }}
        </button>
        <!-- approve pool -->
        <button
          v-else
          class="primary-btn"
          @click="approve"
          :disabled="isApproving || card.status === 'CLOSED'"
        >
          <b-spinner
            small
            type="grow"
            v-show="isApproving || loadingApprovements"
          ></b-spinner>
          {{ $t("operation.approvePool") }}
        </button>
      </template>
    </template>
    <!-- nft stake -->
    <b-modal
      v-model="updateStaking"
      modal-class="custom-modal sub-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <StakingERC1155Modal
        :operate="operate"
        :card="card"
        @hideStakeMask="updateStaking = false"
      />
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { CHAIN_NAME, NutAddress } from "@/config";
import {
  getPoolType,
  approvePoolERC1155,
  getBindSteemAccount,
} from "@/utils/web3/pool";
import Login from "@/components/common/Login";
import ConnectMetaMask from "@/components/common/ConnectMetaMask";
import { handleApiErrCode } from "@/utils/helper";
import StakingERC1155Modal from "@/components/common/StakingERC1155Modal";
import SPStakingModal from "@/components/common/SPStakingModal";
import HPStakingModal from "@/components/common/HPStakingModal";
import { approveUseERC20 } from '@/utils/web3/community'

export default {
  name: "PoolOperationForERC1155",
  props: {
    card: {
      type: Object,
    },
  },
  components: {
    Login,
    ConnectMetaMask,
    StakingERC1155Modal,
    SPStakingModal,
    HPStakingModal
  },
  data() {
    return {
      isApproving: false,
      isApprovingCommunity: false,
      updateStaking: false,
      operate: "add",
      showLogin: false,
      showWrongSteem: false,
      showWrongAccount: false,
      showSpStake: false,
      showHpStake: false,
      isCheckingAccount: false,
      bindSteem: '',
      bindAddress:'',
      chainName: CHAIN_NAME
    };
  },
  computed: {
    ...mapState(["metamaskConnected"]),
    ...mapState("steem", ["steemAccount", "vestsToSteem"]),
    ...mapState("hive", ["hiveAccount", "vestsToHive"]),
    ...mapState('web3', ['account', 'fees']),
    ...mapState('community', ['loadingApproveCommunity', 'approvedCommunity']),
    ...mapState("pool", [
      "totalStaked",
      "userStaked",
      "approvements",
      "userReward",
      "loadingApprovements",
    ]),
    ...mapGetters('web3', ['tokenDecimals']),
    fee() {
      if (this.fees){
        return this.fees['USER'].toFixed(2)
      }
      return 0
    },
    takeFee() {
      if (this.fees) {
        return this.fees['USER'] > 0
      }
      return false
    },
    type() {
      return getPoolType(this.card.poolFactory, this.card.chainId);
    },
    needLogin() {
      if (this.type === "steem") {
        return !this.steemAccount;
      } else if (this.type === "hive") {
        return !this.hiveAccount;
      }
      return false;
    },
    approved() {
      if ((this.type !== 'erc20staking' && this.type !== 'erc1155') || !this.approvements) return true;
      return this.approvements[this.card.id];
    },
    staked() {
      if (!this.userStaked) return 0;
      const userStakingBn = this.userStaked[this.card.id];
      if (!userStakingBn) return 0;
      return userStakingBn.toNumber()
    },
  },
  methods: {
    async increase() {
      this.operate = "add";
      this.updateStaking = true;
    },
    async decrease() {
      this.operate = "minus";
      this.updateStaking = true;
    },
    // Approve pool
    async approve() {
      try {
        this.isApproving = true;
        const hash = await approvePoolERC1155(this.card);
        this.approvements[this.card.id] = true
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
    // approve community
    async approveCommunity () {
      try {
        this.isApprovingCommunity = true
        const hash = await approveUseERC20(NutAddress, this.card.community.id)
        this.$bvToast.toast(this.$t('tip.approveSuccess'), {
          title: this.$t('tip.success'),
          variant: 'success'
        })
        this.$store.commit('community/saveApprovedCommunity', true)
      } catch (e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      } finally {
        this.isApprovingCommunity = false
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "src/static/css/card/common-card";
@import "src/static/css/form";
</style>
