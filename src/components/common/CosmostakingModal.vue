<template>
  <div class="position-relative">
    <i class="modal-close-icon-right" @click="hide"></i>
    <div class="modal-title font20 font-bold">
      {{
        operate === "add"
          ? $t("stake.creaseDelegation")
          : $t("stake.increaseDelegation")
      }}
    </div>
    <div
      style="color: red"
      class="font20 line-height28 font-bold text-center mt-2"
    >
      You're using cosmos account: {{ account }} to delegate
    </div>
    <div class="custom-form">
      <div class="input-group-box mb-3">
        <div class="label text-right">
          <span></span>
          <span class="text-right font20"
            >{{ $t("wallet.balance") }}:
            {{
              (operate === "add" ? formBalance : formStaked) | amountForm
            }}</span
          >
        </div>
        <div
          class="
            c-input-group c-input-group-bg-dark c-input-group-border
            d-flex
          "
        >
          <input
            style="flex: 1"
            type="number"
            v-model="stakingValue"
            placeholder="0"
          />
          <div class="c-append">
            <button
              class="primary-btn input-btn px-2"
              style="height: 1.6rem"
              @click="fillMax"
            >
              {{ $t("commen.max") }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex" style="margin: 0 -1rem">
      <button class="dark-btn mx-3" @click="hide" :disabled="loading">
        {{ $t("operation.cancel") }}
      </button>
      <button class="primary-btn mx-3" @click="confirm" :disabled="loading">
        <b-spinner small type="grow" v-show="loading"></b-spinner
        >{{ $t("operation.confirm") }}
      </button>
    </div>
    <div class="text-center text-grey-light font14 mt-2">
      {{ $t("commen.delegateFee") }}： {{ fee }} ATOM
    </div>
    <!-- <div class="text-center mb-2 mt-4 hover-blue" @click="getSp">{{ $t("stake.getSp") }}</div> -->
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { handleApiErrCode } from "../../utils/helper";
import { getMyJoinedCommunity } from "@/utils/graphql/user";
import { getAllCommunities } from "@/utils/web3/community";
import { strReplace } from "@/utils/commen/util";
import { COSMOS_STAKE_FEE } from "@/config";
import store from "@/store";
import {
  getAccountBalance,
  getDelegateFromCosmos,
  delegate,
  unDelegate,
  addressAccToValBech32,
} from "@/utils/cosmos/cosmos";
export default {
  name: "CosmosStakingModal",
  data() {
    return {
      stakingValue: "",
      loading: false,
      fee: COSMOS_STAKE_FEE,
    };
  },
  computed: {
    ...mapState("pool", ["userStaked"]),
    ...mapState("currentCommunity", ["communityId"]),
    ...mapState("user", ["userGraphInfo"]),
    ...mapState('cosmos', ['balance']),
    staked() {
      if (!this.userStaked) return 0;
      return this.userStaked[this.pool.id] ?? 0;
    },
    formBalance() {
      return this.balance;
    },
    formStaked() {
      const staked = this.staked;
      return (staked.toString() / 1e6);
    },
    account() {
      return strReplace(store.state.cosmos.cosmosAccount, 13, 6, "*", 5);
    },
  },
  props: {
    operate: {
      type: String,
      default: "add",
    },
    pool: {
      type: Object,
    },
  },
  methods: {
    hide() {
      if (this.loading) return;
      this.$emit("hideStakeMask");
    },
    fillMax() {
      if (this.loading) return;
      this.stakingValue =
        this.operate === "add" ? this.formBalance : this.formStaked;
    },
    checkInputValue() {
      const reg = /^\d+(\.\d+)?$/;
      const res =
        reg.test(this.stakingValue) && parseFloat(this.stakingValue) > 0;
      if (!res) {
        this.$bvToast.toast(this.$t("error.inputError"), {
          title: this.$t("error.error"),
          variant: "info",
        });
      }
      return res;
    },
    checkDelegateFee() {
      if (this.operate === "add") {
        if (this.balance >= this.fee + parseFloat(this.stakingValue)) {
          return true;
        }
      }else {
        if (this.balance > this.fee) {
          return true;
        }
      }
      this.$bvToast.toast(this.$t("error.notEnoughFee"), {
        title: this.$t("error.delegateerror"),
        variant: "info",
      });
      return false;
    },
    async confirm() {
      if (!this.checkInputValue()) return;
      if (!this.checkDelegateFee()) return;
      let atom = 0;
      this.loading = true;

      atom = parseFloat(this.stakingValue);

      atom = atom < 0 ? 0 : atom;

      this.delegateAtom(atom);
    },

    async delegateAtom(atom) {
      try {
        const amount = parseInt(atom * 1e6);
        let res;

        if (this.operate === "add") {
          res = await delegate(
            addressAccToValBech32(this.pool.asset),
            amount,
            this.pool.id
          );
        } else {
          res = await unDelegate(
            addressAccToValBech32(this.pool.asset),
            amount,
            this.pool.id
          );
        }
        if (res) {
          if (
            !this.userGraphInfo.inCommunities ||
            this.userGraphInfo.inCommunities
              .map((c) => c.id)
              .indexOf(this.communityId.toLowerCase()) === -1
          ) {
            // first join
            getAllCommunities(true);
            getMyJoinedCommunity();
          }
          getAccountBalance()

          this.$bvToast.toast(
            "Delegate success! The data will be update after 1 or 2 mins later, please wait",
            {
              title: this.$t("tip.success"),
              variant: "success",
              autoHideDelay: 7000,
            }
          );
          setTimeout(() => {
            this.$emit("hideStakeMask");
          }, 4000);
        }
      } catch (e) {
        console.log("Delegate atom fail", e);
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param);
        });
      } finally {
        this.loading = false;
      }
    },
  },
  async mounted() {
    const interval = setInterval(() => {
      try{
        getAccountBalance()
      }catch (e) {

      }
    }, 3000)
    this.$once('hook:beforeDestroy', () => {
      window.clearInterval(interval);
    })
  },
};
</script>

<style lang="scss" scoped>
@import "src/static/css/modal";
@import "src/static/css/form";
</style>
