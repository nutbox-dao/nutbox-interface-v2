<template>
  <div>
    <ConnectMetaMask class="w-100"
      :disable="card.status === 'CLOSED'"
      v-if="!metamaskConnected"
    />
    <template v-else>
      <div
        class="d-flex justify-content-between align-items-center "
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
            <i class="sub-icon sub-icon-primary"></i>
          </button>
          <!-- increase -->
          <button
            class="symbol-btn symbol-btn-outline hover"
            :disabled="card.status === 'CLOSED' || isCheckingAccount"
            @click="increase"
          >
            <i class="add-icon add-icon-primary"></i>
          </button>
        </div>
      </div>
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
      <div class="position-relative">
    <i class="modal-close-icon-right" @click="updateStaking = false"></i>
    <div class="modal-title font20 font-bold" >
      {{
        operate === "add"
          ? $t("stake.stake")
          : $t("stake.unStake")
      }}
    </div>
    <div class="custom-form my-3">
      <div class="input-group-box mb-4">
        <div class="label text-right font20">
          <span class="text-right">{{ $t('wallet.balance') }}: {{ (operate === 'add' ? formBalance : staked) | amountForm }}</span>
        </div>
        <div class="c-input-group c-input-group-border c-input-group-bg-dark d-flex">
          <input style="flex: 1"
                 type="number"
                 v-model="stakingValue"
                 placeholder="0"
          />
          <div class="c-append">
            <button class="primary-btn input-btn px-2" style="height: 1.6rem"
                    @click="fillMax">{{ $t("commen.max") }}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex" style="margin: 0 -1rem">
      <button class="dark-btn mx-3" @click="updateStaking = false" :disabled='loading'>{{
            $t("operation.cancel")
          }}</button>
      <button class="primary-btn mx-3" @click="confirm" :disabled='loading'><b-spinner small type="grow" v-show="loading"></b-spinner
      >{{ $t("operation.confirm") }}</button>
    </div>
  </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { CHAIN_NAME } from "@/config";
import ConnectMetaMask from "@/components/common/ConnectMetaMask";
import { handleApiErrCode } from "@/utils/helper";
import StakingHomeChainAssetModal from "@/components/common/StakingHomeChainAssetModal";
import { getBalance } from "@/utils/web3/asset";
import { getMyJoinedCommunity } from '@/utils/graphql/user'
import { getAllCommunities } from '@/utils/web3/community'
import {stake, unStake } from '@/utils/web3/dappstaking'

export default {
  name: "PoolOperationDappStaking",
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
      updateStaking: false,
      operate: "add",
      isCheckingAccount: false,
      chainName: CHAIN_NAME,
      stakingValue: '',
      loading: false,
      stakedDecimal: 18,
      ctokenDecimal: 18
    };
  },
  computed: {
    ...mapState(["metamaskConnected"]),
    ...mapState('web3', ['account', 'fees', 'balance']),
    ...mapState('user', ['userGraphInfo']),
    ...mapState('currentCommunity', ['communityId']),
    ...mapState("pool", [
      "totalStaked",
      "userStaked",
      "userReward"
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
      return 'erc20staking';
    },
    staked() {
      if (!this.userStaked) return 0;
      const userStakingBn = this.userStaked[this.card.id];
      if (!userStakingBn) return 0;
      return userStakingBn.toString() / (10 ** this.tokenDecimals(this.card.asset));
      return 0;
    },
    formBalance() {
      return this.balance.toString() / 1e18
    }
  },
  methods: {
    async increase() {
      this.operate = "add";
      getBalance();
      this.stakingValue = ''
      this.updateStaking = true;
    },
    async decrease() {
      this.operate = "minus";
      this.stakingValue = ''
      this.updateStaking = true;
    },
    fillMax(){
        this.stakingValue =
        this.operate === "add" ? this.formBalance : this.staked;
    },
    checkInputValue() {
      const reg = /^\d+(\.\d+)?$/;
      const res =
        reg.test(this.stakingValue) && parseFloat(this.stakingValue) > 0;
      if (!res) {
        this.$bvToast.toast(this.$t('error.inputError'), {
          title: this.$t("error.error"),
          variant: 'info'
        })
      }
      return res;
    },
    async confirm() {
      if (!this.checkInputValue()) return;
      try{
        this.loading = true
        let message;
        if (this.operate === 'add'){
          await stake(this.card.id, this.stakingValue)
          message = this.$t('transaction.depositOk')
        }else{
          await unStake(this.card.id, this.stakingValue)
          message = this.$t('transaction.withdrawOk')
        }
        this.$bvToast.toast(message, {
          title: this.$t('tip.success'),
          variant: 'success'
        })
        setTimeout(() => {
          if (!this.userGraphInfo.inCommunities || this.userGraphInfo.inCommunities.map(c => c.id).indexOf(this.communityId.toLowerCase()) === -1){
            // first join
            getAllCommunities(true)
            getMyJoinedCommunity()
          }
          getBalance()
          this.updateStaking = false
        }, 3000);
      } catch (e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      } finally {
        this.loading = false
      }
    }
  },
  mounted () {
    this.ctokenDecimal = this.tokenDecimals(this.card.community.cToken);
  },
};
</script>

<style lang="scss" scoped>
@import "src/static/css/card/common-card";
@import "src/static/css/form";
</style>
