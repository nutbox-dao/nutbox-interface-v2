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
        {{ $t("cs.bondAndNominate") }}
      </div>
      <div class="input-group-box">
        <div class="label flex-between-center">
          <span>
            {{ $t('cs.bondedAmount') }}: {{ locked }}
          </span>
          <span>
            {{ $t("cs.available") }}: {{ formatBalance }}
          </span>
          </div>
        <div class="flex-between-center">
          <input type="number" v-model="inputAmount" />
        </div>
      </div>
      <div class="text-center mb-4 font16">
        <p class="bondInfo">{{ $t("cs.bondInfo2") }} <span style="color:red;font-weight: 500">{{ minNominatorBond }} {{ this.symbol }}</span></p>
        <p class="bondInfo">{{ $t("cs.bondInfo1") }}</p>
        <p class="bondInfo">{{ $t("cs.bondInfo3", {days : crowdstaking.chainId === 2 ? 28 : 7 }) }}</p>
      </div>
      <button class="primary-btn" @click="confirm" :disabled="isBondAndNominating">
        <b-spinner small type="grow" v-show="isBondAndNominating"></b-spinner
        >{{ $t("cs.confirm") }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { formatBalance as fb } from "@/utils/polkadot/polkadot";
import { formatBalance as kfb } from '@/utils/kusama/kusama'
import BN from "bn.js";
import { bondAndNominate, getMinNominatorBond } from "@/utils/commen/crowdStaking";

export default {
  data() {
    return {
      inputAmount: "",
      inputNonimator: "",
      paraTokenSymbol: "",
      isBondAndNominating: false,
      minNominatorBond: 0
    };
  },
  props: {
    crowdstaking: {
      type: Object,
    }
  },
  computed: {
    ...mapState(['lang']),
    ...mapState({
      pLocked: state => state.polkadot.locked,
      kLocked: state => state.kusama.locked
    }),
    locked () {
      return this.crowdstaking.chainId === 2 ? (this.pLocked.toNumber() / 1e10).toFixed(4) + this.symbol : (this.kLocked.toNumber() / 1e12).toFixed(4) + this.symbol
    },
    available () {
      return this.crowdstaking.chainId === 2 ? this.$store.getters['polkadot/available'] : this.$store.getters['kusama/available']
    },
    formatBalance() {
      let uni = (this.crowdstaking.chainId === 2 ? fb : kfb)(this.available);
      return uni;
    },
    symbol() {
      return this.crowdstaking.chainId === 2 ? 'DOT' : 'KSM'
    }
  },
  methods: {
    hide() {
      if (this.isBondAndNominating) return;
      this.$emit("hideBondAndNominate");
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
      if (amount + parseFloat(this.locked) < parseFloat(this.minNominatorBond)) {
        this.$bvToast.toast(this.$t("tip.belowMinBond", { min: this.minNominatorBond + this.symbol }), {
          title: this.$t("tip.tips"),
          autoHideDelay: 5000,
          variant: "warning",
        });
        return;
      }
      if (this.available.lte(new BN(amount * (this.symbol === 'polkadot' ? 1e10 : 1e12)))) {
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
        this.isBondAndNominating = true
        await bondAndNominate(
          this.crowdstaking.chainId === 2 ? 'polkadot' : 'kusama',
          this.inputAmount,
          [this.crowdstaking.validatorAccount],
          this.crowdstaking.validatorAccount,
          this.crowdstaking.validatorAccount,
          (info, param) => {
            this.$bvToast.toast(info, param);
          },
          () => {
            this.$emit("hideBondAndNominate");
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
        this.isBondAndNominating = false
      }
    },
  },
  mounted() {
    getMinNominatorBond(this.crowdstaking.chainId === 2 ? 'polkadot' : 'kusama').then(res => {
      this.minNominatorBond = this.crowdstaking.chainId == 2 ? res.toNumber() / 1e10 : res.toNumber() / 1e12
    })
  },
};
</script>

<style lang="less" scoped>
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
</style>
