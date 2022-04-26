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
            @click="contribute"
            :disabled="isCheckingAccount || !enableContribute"
          >
            <b-spinner small v-show="isCheckingAccount" type="grow"></b-spinner>
            {{ operationText }}
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

    <!-- contribute -->
    <b-modal
      v-model="showContribute"
      modal-class="custom-modal sub-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <CrowdloanContributeModal
        :operate="operate"
        :card="card"
        @hideStakeMask="updateStaking = false"
      />
    </b-modal>

    <!-- wrong polkadot account -->
    <b-modal
      v-model="showWrongPolkadot"
      modal-class="custom-modal sub-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <div class="custom-form position-relative">
        <i class="modal-close-icon-right" @click="showWrongPolkadot = false"></i>
        <div class="modal-title">
          Please change {{ relaychain }} Account
        </div>
        <div class="text-center font20 line-height24 mt-3">
          Your {{ relaychain }} account haven't binding with current
          {{ chainName }} address, please change
          {{ relaychain }} account in your wallet first.
        </div>
        <div class="mt-3 mb-1 text-center font20 line-height24">
          Your binding {{ relaychain }} account is:
        </div>
        <div class="c-input-group c-input-group-bg-dark c-input-group-border">
          <input class="text-center" disabled type="text" :value="bindPolkadot" />
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
          @click="(showWrongCosmos = false)"
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
          {{ relaychain }} account, please change
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
          Cancel
        </button>
        <button
          class="primary-btn mx-3"
          @click="(showWrongAccount = false)"
        >
          OK
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { CHAIN_NAME, NutAddress } from "@/config";
import {
  approvePool,
  getBindPolkadotAccount
} from "@/utils/web3/pool";
import ConnectMetaMask from "@/components/common/ConnectMetaMask";
import { handleApiErrCode } from "@/utils/helper";
import CrowdloanContributeModal from "@/components/common/CrowdloanContributeModal";
import { approveUseERC20 } from '@/utils/web3/community'
import { stanfiAddress } from "@/utils/polkadot/account";
import { ethers } from 'ethers'

export default {
  name: "PoolOperationCrowdloan",
  props: {
    card: {
      type: Object,
    },
  },
  components: {
    ConnectMetaMask,
    CrowdloanContributeModal
  },
  data() {
    return {
      isApproving: false,
      isApprovingCommunity: false,
      showContribute: false,
      operate: "add",
      isCheckingAccount: false,
      chainName: CHAIN_NAME,
      operationText: 'Loading',
      bindPolkadot: '',
      bindAddress: '',
      showWrongPolkadot: false,
      showWrongAccount: false
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
    fund() {
      if (parseInt(this.card.chainId) === 0){
        const funds = this.polkadotFund.filter(f => f.pId == parseInt(this.card.paraId))
        if (funds.length > 0){
          return funds[0]
        }
        return {}
      }else if (parseInt(this.card.chainId) === 2) {
        const funds = this.kusamaFund.filter(f => f.pId == parseInt(this.card.paraId))
        if (funds.length > 0) {
          return funds[0]
        }
        return {}
      }
    },
    enableContribute() {
      if (parseInt(this.fund.fundIndex || 0) !== parseInt(this.card.fundIndex)) {
        this.operationText = this.$t('operation.end')
        return false
      }
      if (this.fund.statusIndex === 0) {
        this.operationText = this.$t('operation.contribute')
        return true
      }else if (this.fund.statusIndex === 2){
        this.operationText = this.$t('operation.winner')
        return false
      } else {
        this.operationText = this.$t('operation.end')
        return false
      }
    },
    type() {
      return 'crowdloan';
    },
    relaychain() {
      return this.card.chainId === 0 ? 'Polkadot' : 'Kusama'
    },
    formatPolkadotAccount() {
      if (this.polkadotAccount) {
        return stanfiAddress(this.polkadotAccount, this.card.chainId)
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
    async contribute() {
      try{
        this.isCheckingAccount = true
        const bindInfo = await getBindPolkadotAccount(this.card);
        console.log(325, bindInfo);
        if (bindInfo.account[1] === bindInfo.bindAccount[0]) return true;
        if (bindInfo.account[1] === ethers.constants.HashZero) {
          if (bindInfo.bindAccount[1] === ethers.constants.AddressZero) {
            return true;
          }
          if (bindInfo.bindAccount[1].toLowerCase() !== this.account.toLowerCase()) {
            this.bindAddress = bindInfo.bindAccount[1];
            this.showWrongAccount = true;
            return;
          }
        }
        if (bindInfo.account[1] !== bindInfo.bindAccount[0]) {
          this.bindPolkadot = bindInfo.account[1];
          this.showWrongPolkadot = true;
          return
        }
        return true;
      } catch (e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param);
        });
      } finally {
        this.isCheckingAccount = false
      }
    },
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
