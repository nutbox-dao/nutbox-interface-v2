<template>
  <div>
    <div class="wallet-card">
      <div class="top flex-between-center">
        <img :src="logo" alt="" class="logo" />
        <div class="balance-right flex-full">
          <div class="flex-between-center font-bold font16 mb-1">
            <span>{{ name }}</span>
            <span>{{ balances | amountForm(4) }}</span>
          </div>
          <div class="text-left font12 desc">
            <span>{{ desc }}</span>
          </div>
        </div>
      </div>
      <div class="btn-group btn-group-2">
        <button class="primary-btn" @click="showTransfer = true"
                :disabled="parseFloat(balances) < 0.0001">
          {{ $t("wallet.transfer") }}
        </button>
        <button class="primary-btn" @click="showBond = true"
          :disabled="parseFloat(balances) < 0.0001">
          {{ $t("wallet.bond") }}
        </button>
      </div>
    </div>
    <b-modal
      v-model="showTransfer"
      modal-class="custom-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <TipTransfer @hideTransfer="showTransfer = false" />
    </b-modal>

    <b-modal
      v-model="showBond"
      modal-class="custom-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <TipBond @hideBond="showBond = false" />
    </b-modal>
  </div>
</template>

<script>
import TipTransfer from "./TipTransfer";
import TipBond from "./TipBond";

export default {
  name: "BalanceView",
  data() {
    return {
      showTransfer: false,
      showBond: false,
    };
  },
  props: {
    name: {
      type: String,
      default: "DOT",
    },
    balances: {
      type: Number,
      default: 0.0,
    },
    logo: {
      type: String,
      default: "",
    },
    desc: {
      type: String,
      default: "DOT",
    },
    balanceDigit: {
      type: Number,
      default: 4,
    },
  },
  components: {
    TipTransfer,
    TipBond,
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import "src/static/css/card/wallet-card";
</style>
