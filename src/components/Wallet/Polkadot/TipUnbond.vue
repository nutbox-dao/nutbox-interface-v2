<template>
  <div class="tip-modal">
    <img
      class="close-btn"
      src="~@/static/images/close.svg"
      alt=""
      @click="hide"
    />
    <div class="tip-contribute">
      <div class="text-center mb-4 font20">
        {{ $t("wallet.unBond") }}
      </div>
      <div class="input-group-box">
        <div class="label">{{ $t("wallet.balance") }}: {{ locked / 1e10 | amountForm(4) }} DOT</div>
        <div class="flex-between-center">
          <input type="number" v-model="inputAmount" />
        </div>
      </div>
      <button class="primary-btn" @click="confirm" :disabled="isUnBonding">
        <b-spinner small type="grow" v-show="isUnBonding"></b-spinner
        >{{ $t("cs.confirm") }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import BN from "bn.js";
import { unBond } from "@/utils/polkadot/account";

export default {
  data() {
    return {
      inputAmount: "",
      inputNonimator: "",
      paraTokenSymbol: "",
      isUnBonding: false,
    };
  },
  computed: {
    ...mapState(['lang']),
    ...mapState('polkadot',["locked"]),
  },
  methods: {
    hide() {
      if (this.isUnBonding) return;
      this.$emit("hideBond");
    },
    checkInput() {
      const reg = /^\d+(\.\d+)?$/;
      const res = reg.test(this.inputAmount);
      if (!res) {
        this.$bvToast.toast("Input error!", {
          title: this.$t("tip.tips"),
          autoHideDelay: 5000,
          variant: "warning", // info success danger
        });
        return false;
      }
      const amount = parseFloat(this.inputAmount);

      if (amount < 0.1) {
        this.$bvToast.toast(this.$t("tip.belowMinBond"), {
          title: this.$t("tip.tips"),
          autoHideDelay: 5000,
          variant: "warning",
        });
        return;
      }

      if (this.locked.lte(new BN(amount*1e4).mul(new BN(1e6)))) {
        this.$bvToast.toast(this.$t("tip.insufficientBalance"), {
          title: this.$t("tip.tips"),
          autoHideDelay: 5000,
          variant: "warning", // info success danger
        });
        return false;
      }
      return true;
    },
    async confirm() {
      if (!this.checkInput()) {
        return;
      }
      try {
        this.isUnBonding = true
        await unBond(
          this.inputAmount,
          (info, param) => {
            this.$bvToast.toast(info, param);
          },
          () => {
            this.$emit("hideBond");
          }
        );
      } catch (e) {
        console.log("eee", e);
        this.$bvToast.toast(e.message, {
          title: this.$t("tip.error"),
          autoHideDelay: 5000,
          variant: "danger",
        });
      } finally {
        this.isUnBonding = false
      }
    },
  },
  mounted() {
  },
};
</script>

<style lang="less">
.tip-modal {
  position: relative;
  .close-btn {
    position: absolute;
    right: 0;
    width: 1rem;
    height: 1rem;
  }
  .primary-btn {
    width: 100%;
    margin-top: 1rem;
  }
  .big {
    background-image: linear-gradient(
      to right,
      var(--primary-custom),
      var(--primary-custom)
    );
    background-size: 90% 50%;
    background-repeat: no-repeat;
    background-position-y: bottom;
    background-position-x: 50%;
  }
}
.bondInfo {
  text-align: left;
  margin-bottom: 0px;
}
.input-group-box {
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  input {
    flex: 1;
    border: none;
    background: rgba(246, 247, 249, 1);
    font-size: 0.8rem;
    height: 2.4rem;
    padding: 0.4rem 0.8rem;
    box-sizing: border-box;
    border-radius: 0.8rem;
    margin-right: 1rem;
  }
  span {
    display: inline-block;
    min-width: 5rem;
  }
}
.label {
  text-align: left;
  margin-bottom: 12px;
}
</style>
