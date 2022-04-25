<template>
  <div>
    <ConnectMetaMask class="w-100"
      :disable="card.status === 'CLOSED'"
      v-if="!metamaskConnected"
    />
    <template v-else>
      <div
        class="d-flex justify-content-between align-items-center "
        v-if="(!takeFee || approvedCommunity)"
      >
        <span class="value flex-fill">
          {{ staked | amountForm }}
        </span>
        <div class="d-flex">
          <!-- contribute -->
          <button
            class="primary-btn hover"
            @click="decrease"
            :disabled="isCheckingAccount"
          >
            {{ $t('operation.contribute') }}
          </button>
        </div>
      </div>
      <template v-else>
        <template >
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
            {{ $t("operation.approve") + ' Community' }}
          </button>
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
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { CHAIN_NAME, NutAddress } from "@/config";
import {
  approvePool
} from "@/utils/web3/pool";
import ConnectMetaMask from "@/components/common/ConnectMetaMask";
import { handleApiErrCode } from "@/utils/helper";
import StakingHomeChainAssetModal from "@/components/common/StakingHomeChainAssetModal";
import { approveUseERC20 } from '@/utils/web3/community'
import { stanfiAddress } from "@/utils/polkadot/account";

export default {
  name: "PoolOperationCrowdloan",
  props: {
    card: {
      type: Object,
    },
  },
  components: {
    ConnectMetaMask,
    StakingHomeChainAssetModal
  },
  data() {
    return {
      isApproving: false,
      isApprovingCommunity: false,
      updateStaking: false,
      operate: "add",
      isCheckingAccount: false,
      chainName: CHAIN_NAME
    };
  },
  computed: {
    ...mapState(["metamaskConnected"]),
    ...mapState('web3', ['account', 'fees']),
    ...mapState('community', ['loadingApproveCommunity', 'approvedCommunity']),
    ...mapState("pool", [
      "totalStaked",
      "userStaked",
      "approvements",
      "userReward",
      "loadingApprovements",
    ]),
    ...mapState({
      polkadotFund: state => state.polkadot.clProjectFundInfos,
      kusamaFund: state => state.kusama.clProjectFundInfos,
      polkadotLoading: state => state.polkadot.loadingFunds,
      kusamaLoading: state => state.kusama.loadingFunds,
      polkadotAccount: state => state.polkadot.account
    }),
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
      return 'crowdloan';
    },
    relaychain() {
      return this.card.chainId === 0 ? 'Polkadot' : 'Kusama'
    },
    formatPolkadotAccount() {
      if (this.polkadotAccount) {
        return stanfiAddress(this.polkadotFund, this.card.chainId)
      }
    },
    staked() {
      if (!this.userStaked) return 0;
      const userStakingBn = this.userStaked[this.card.id];
      if (!userStakingBn) return 0;
      return userStakingBn.toString() / (10 ** this.tokenDecimals(this.card.asset));
      return 0;
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
