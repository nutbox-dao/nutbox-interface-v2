<template>
  <div>
    <Card>
      <div class="top">
        <img :src="logo" alt="" class="icon" />
        <div class="balance-right">
          <div class="balance-name">
            <span class="title">
              {{ name }}
            </span>
            <div>
              <span style="font-size: 12px; color: var(--secondary-text)">
                {{ desc }}
              </span>
            </div>
          </div>
          <div class="balance">
            <span class="title">
              {{ balances | amountForm(4) }}
            </span>
          </div>
        </div>
      </div>
      <div class="bottom">
         <b-button
          variant="primary"
          @click="showTransfer = true"
          :disabled="parseFloat(balances) < 0.0001"
        >
          {{ $t("wallet.transfer") }}
        </b-button>
        <b-button
          variant="primary"
          @click="showBond = true"
          :disabled="parseFloat(balances) < 0.0001"
        >
          {{ $t("wallet.bond") }}
        </b-button>
      </div>
    </Card>
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
import Card from "@/components/ToolsComponents/Card";
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
      default: 0.00,
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
    Card,
    TipTransfer,
    TipBond
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  min-width: 320px;
  .top {
    margin: 0;
    padding: 0;
    display: flex;
    .icon {
      width: 56px;
      height: 56px;
      margin-right: 8px;
    }
    .balance-right {
      display: flex;
      flex: 1;
      align-content: center;
      justify-content: space-between;
      margin-top: 6px;
      span {
        text-align: left;
      }
      .title {
        font-size: 16px;
        font-weight: 600;
      }
      .balance-name {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        img:hover {
          cursor: pointer;
        }
      }
    }
  }
  .bottom{
    padding: 14px 0 0 0 ;
    display: flex;
    align-content: center;
    justify-content: space-between;
  }
  button {
    width: 48% !important;
  }
}
</style>
