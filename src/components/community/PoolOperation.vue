<template>
  <div>
    <ConnectMetaMask v-if="!metamaskConnected" />
    <template v-else>
      <div
        class="d-flex justify-content-between align-items-center mb-4"
        v-if="approved && !needLogin"
      >
        <span class="value flex-fill">
          {{ staked | amountForm }}
        </span>
        <div class="d-flex">
          <button class="symbol-btn hover" @click="decrease">-</button>
          <button class="symbol-btn hover" @click="increase">+</button>
        </div>
      </div>
      <template v-else>
        <button class="primary-btn" v-if="needLogin" @click="showLogin = true">
            {{ type === 'STEEM' ? $t('wallet.connectSteem') : $t('wallet.connectHive') }}
        </button>
        <button v-else class="primary-btn" @click="approve" :disabled="approved || isApproving">
          <b-spinner
            small
            type="grow"
            v-show="isApproving || loadingApprovements"
          ></b-spinner>
          {{ $t("operation.approve") }}
        </button>
      </template>
    </template>

    <b-modal
      v-model="updateStaking"
      modal-class="custom-modal"
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

    <Login :type='type' v-if="showLogin" @hideMask="showLogin = false" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { CHAIN_NAME } from "@/config";
import { getPoolType, approvePool } from '@/utils/web3/pool'
import Login from '@/components/common/Login'
import ConnectMetaMask from '@/components/common/ConnectMetaMask'
import { handleApiErrCode } from '@/utils/helper'

export default {
  name: "PoolOperation",
  props: {
    card: {
      type: Object,
    },
  },
  components: {
      Login,
      ConnectMetaMask
  },
  data() {
      return {
        isApproving: false,
        updateStaking: false,
        operate: 'add',
        showLogin: false
      }
  },
  computed: {
    ...mapState(["metamaskConnected"]),
    ...mapState("steem", ["steemAccount", "vestsToSteem"]),
    ...mapState("hive", ["hiveAccount", "vestsToHive"]),
    ...mapState("pool", [
      "totalStaked",
      "userStaked",
      "approvements",
      "userReward",
      "loadingApprovements",
    ]),
    type() {
      return getPoolType(this.card.poolFactory, this.card.chainId);
    },
    needLogin() {
        if (this.type === 'STEEM') {
            return !this.steemAccount
        }else if(this.type === 'HIVE') {
          console.log(325, this.hiveAccount);
            return !this.hiveAccount
        }
        return false
    },
    approved() {
      if (this.type !== CHAIN_NAME || !this.approvements) return true;
      return this.approvements[this.card.id];
    },
    staked() {
      if (!this.userStaked) return 0;
      const userStakingBn = this.userStaked[this.card.id];
      if (!userStakingBn) return 0;
      if (this.type === CHAIN_NAME) {
        return userStakingBn.toString() / 1e18;
      } else if (this.type === "STEEM") {
        return userStakingBn.toString() / 1e6 * this.vestsToSteem;
      } else if (this.type === "HIVE") {
        return userStakingBn.toString() / 1e6 * this.vestsToHive;
      }
      return 0;
    },
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
  },
};
</script>

<style lang="scss" scoped>
@import "src/static/css/card/common-card";
</style>