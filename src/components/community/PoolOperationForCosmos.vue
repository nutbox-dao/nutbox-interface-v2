<template>
  <div>
    <ConnectMetaMask
      class="w-100"
      :disable="card.status === 'CLOSED'"
      v-if="!metamaskConnected"
    />
    <template v-else>
      <template v-if="notInstallKeplr">
        <button class="primary-btn">
          {{ $t("wallet.intallKeplr") }}
        </button>
      </template>
      <template v-else>
        <div
          class="d-flex justify-content-between align-items-center"
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
              :disabled="isCheckingAccount"
            >
              <i v-if="isCheckingAccount" class="loading-icon-gray"></i>
              <i v-else class="sub-icon sub-icon-primary"></i>
            </button>
            <!-- increase -->
            <button
              class="symbol-btn symbol-btn-outline hover"
              :disabled="card.status === 'CLOSED' || isCheckingAccount"
              @click="increase"
            >
              <i v-if="isCheckingAccount" class="loading-icon-gray"></i>
              <i v-else class="add-icon add-icon-primary"></i>
            </button>
          </div>
        </div>
        <template v-else>
          <!-- steem hive login -->
          <button class="primary-btn" v-if="needLogin" @click="connectKeplr()">
            {{ $t("wallet.connectCosmos") }}
          </button>
          <template v-else>
            <!-- approve community -->
            <button
              v-if="takeFee && (loadingApproveCommunity || !approvedCommunity)"
              class="primary-btn"
              @click="approveCommunity"
              :disabled="
                loadingApproveCommunity ||
                isApprovingCommunity ||
                card.status === 'CLOSED'
              "
            >
              <b-spinner
                small
                type="grow"
                v-show="isApprovingCommunity || loadingApproveCommunity"
              ></b-spinner>
              {{ $t("operation.approve") + " Community" }}
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
              {{ $t("operation.approve") + " Pool" }}
            </button>
          </template>
        </template>
      </template>
    </template>
    <!-- main chain stake -->
    <b-modal
      v-model="updateStaking"
      modal-class="custom-modal sub-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <StakingHomeChainAssetModal
        :operate="operate"
        :card="card"
        @hideStakeMask="updateStaking = false"
      />
    </b-modal>

    <!-- hp stake  -->
    <b-modal
      v-model="showCosmosStake"
      modal-class="custom-modal sub-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <CosmostakingModal
        :operate="operate"
        :pool="card"
        @hideStakeMask="showCosmosStake = false"
      />
    </b-modal>

    <!-- wrong steem account -->
    <b-modal
      v-model="showWrongCosmos"
      modal-class="custom-modal sub-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <div class="custom-form position-relative">
        <i class="modal-close-icon-right" @click="showWrongCosmos = false"></i>
        <div class="modal-title">
          Please change {{ type.toUpperCase() }} Account
        </div>
        <div class="text-center font20 line-height24 mt-3">
          Your {{ type.toUpperCase() }} account haven't binding with current
          {{ chainName }} address, please change
          {{ type.toUpperCase() }} account in your wallet first.
        </div>
        <div class="mt-3 mb-1 text-center font20 line-height24">
          Your binding {{ type.toUpperCase() }} account is:
        </div>
        <div class="c-input-group c-input-group-bg-dark c-input-group-border">
          <input class="text-center" disabled type="text" :value="bindCosmos" />
        </div>
      </div>
      <div class="d-flex justify-content-between mt-3" style="margin: 0 -1rem">
        <button
          class="dark-btn primary-btn-outline mx-3"
          @click="showWrongCosmos = false"
        >
          Cancel
        </button>
        <button
          class="primary-btn mx-3"
          @click="(showWrongCosmos = false), (showLogin = true)"
        >
          OK
        </button>
      </div>
    </b-modal>
    <!-- wrong main chain account -->
    <b-modal
      v-model="showWrongAccount"
      modal-class="custom-modal sub-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <div class="custom-form text-center position-relative">
        <i class="modal-close-icon-right" @click="showWrongAccount = false"></i>
        <div class="modal-title">Please change {{ chainName }} address</div>
        <div class="font20 line-height24 mt-3">
          Your {{ chainName }} address haven't binding with current
          {{ type.toUpperCase() }} account, please change
          {{ chainName }} address in your wallet first.
        </div>
        <div class="mt-3 mb-1">Your binding address is:</div>
        <div class="c-input-group c-input-group-bg-dark c-input-group-border">
          <input
            class="text-center"
            disabled
            type="text"
            :value="bindAddress"
          />
        </div>
      </div>
      <div class="d-flex justify-content-between mt-3" style="margin: 0 -1rem">
        <button
          class="primary-btn primary-btn-outline mx-3"
          @click="showWrongAccount = false"
        >
          OK
        </button>
        <button
          class="primary-btn mx-3"
          @click="(showWrongAccount = false), (showLogin = true)"
        >
          Change {{ type.toUpperCase() }}
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { CHAIN_NAME, NutAddress } from "@/config";
import {
  getPoolType,
  approvePool,
  getBindCosmosAccount,
} from "@/utils/web3/pool";
import Login from "@/components/common/Login";
import ConnectMetaMask from "@/components/common/ConnectMetaMask";
import { handleApiErrCode } from "@/utils/helper";
import StakingHomeChainAssetModal from "@/components/common/StakingHomeChainAssetModal";

import CosmostakingModal from "@/components/common/CosmostakingModal";
import { approveUseERC20 } from "@/utils/web3/community";
import { getAccount } from "@/utils/cosmos/cosmos";
import store from "@/store";
export default {
  name: "PoolOperation",
  props: {
    card: {
      type: Object,
    },
  },
  components: {
    Login,
    ConnectMetaMask,
    StakingHomeChainAssetModal,
    CosmostakingModal,
  },
  data() {
    return {
      isApproving: false,
      isApprovingCommunity: false,
      updateStaking: false,
      operate: "add",
      showLogin: false,
      showWrongCosmos: false,
      showWrongAccount: false,
      showCosmosStake: false,
      isCheckingAccount: false,
      bindCosmos: "",
      bindAddress: "",
      chainName: CHAIN_NAME,
    };
  },
  computed: {
    ...mapState(["metamaskConnected"]),

    ...mapState("web3", ["account", "fees"]),
    ...mapState("community", ["loadingApproveCommunity", "approvedCommunity"]),
    ...mapState("pool", [
      "totalStaked",
      "userStaked",
      "approvements",
      "userReward",
      "loadingApprovements",
    ]),
    ...mapGetters("web3", ["tokenDecimals"]),
    fee() {
      if (this.fees) {
        return this.fees["USER"].toFixed(2);
      }
      return 0;
    },
    takeFee() {
      if (this.fees) {
        return this.fees["USER"] > 0;
      }
      return false;
    },
    type() {
      return getPoolType(this.card.poolFactory, this.card.chainId);
    },
    needLogin() {
      if (!store.state.cosmos.account) {
        return true;
      }
      return false;
    },
    approved() {
      if (this.type !== "erc20staking" || !this.approvements) return true;
      return this.approvements[this.card.id];
    },
    staked() {
      if (!this.userStaked) return 0;
      const userStakingBn = this.userStaked[this.card.id];
      if (!userStakingBn) return 0;

      return userStakingBn.toString() / 1e6;
    },
    notInstallKeplr() {
      if (!window.getOfflineSigner || !window.keplr) {
        return true;
      }
      return false;
    },
  },
  methods: {
    async increase() {
      this.operate = "add";
      if (this.type === "cosmos") {
        if (await this.checkAccount()) {
          this.showCosmosStake = true;
        }
      }
    },
    async decrease() {
      this.operate = "minus";
      if (this.type === "cosmos") {
        if (await this.checkAccount()) {
          this.showCosmosStake = true;
        }
      }
    },
    async checkAccount() {
      this.isCheckingAccount = true;
      try {
        const bindInfo = await getBindCosmosAccount(this.card);
        const cosmosAcc = store.state.cosmos.account;

        if (bindInfo.account[1] === cosmosAcc) return true;
        if (
          bindInfo.account[1] === "" ||
          bindInfo.account[1] ===
            "cosmos1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqnrql8a"
        ) {
          if (
            bindInfo.bindAccount[1] ===
            "0x0000000000000000000000000000000000000000"
          )
            return true;
          if (
            bindInfo.bindAccount[1].toLowerCase() !== this.account.toLowerCase()
          ) {
            this.bindAddress = bindInfo.bindAccount[1];
            this.showWrongAccount = true;
            return;
          }
        }
        if (bindInfo.account[1] !== cosmosAcc) {
          this.bindCosmos = bindInfo.account[1];
          this.showWrongCosmos = true;
          return;
        }
        return true;
      } catch (e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param);
        });
      } finally {
        this.isCheckingAccount = false;
      }
    },
    // Approve pool
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
    // approve community
    async approveCommunity() {
      try {
        this.isApprovingCommunity = true;
        const hash = await approveUseERC20(NutAddress, this.card.community.id);
        this.$bvToast.toast(this.$t("tip.approveSuccess"), {
          title: this.$t("tip.success"),
          variant: "success",
        });
        this.$store.commit("community/saveApprovedCommunity", true);
      } catch (e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param);
        });
      } finally {
        this.isApprovingCommunity = false;
      }
    },
    async connectKeplr() {
      await getAccount();
    },
  },
  async mounted() {
    await getAccount();
  },
};
</script>

<style lang="scss" scoped>
@import "src/static/css/card/common-card";
@import "src/static/css/form";
</style>
