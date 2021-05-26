<template>
  <div>
    <span>
      {{ items && items[0] }}
    </span>
    <span class="text-grey-light">
      {{ items && items[1] }}
    </span>
    <span>
      {{ items && items[2] }}
    </span>
    <span class="text-grey-light">
      {{ items && items[3] }}
    </span>
    <span>
      {{ items && items[4] }}
    </span>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { KUSAMA_DECIMAL } from '@/constant'
import BN from "bn.js";
export default {
  props: {
    paraId: {
      type: Number,
      default: 0,
    },
    isBalance: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('polkadot', ["account"]),
    ...mapState('kusama', ["balance"]),
    ...mapGetters('kusama', ["fundInfo"]),
    fund() {
      return this.fundInfo(this.paraId);
    },
    items() {
      if (!this.fund) return;
      let raised;
      let cap;
      if (this.isBalance){
        const myData = this.fund.funds.filter(c=>c.contributor == this.account.address)
        if (myData.length === 0){
          raised = new BN(0);
        }else{
          raised = myData[0].amount
        }
        cap = this.balance
        raised = this.convertUni(raised)
        cap = this.convertUni(cap)
      }else{
        raised = this.convertUni(this.fund.raised);
        cap = this.convertUni(this.fund.cap);
      }
      const raisedStr = this.formatBanlance(raised[0]);
      const capStr = this.formatBanlance(cap[0]);
      return [
        raisedStr[0],
        raisedStr[1],
        raised[1] + "/" + capStr[0],
        capStr[1],
        cap[1] + 'KSM',
      ];
    },
  },
  methods: {
    convertUni(uni) {
      let unit = " ";
      uni = new BN(uni)
      uni = uni.div(new BN(10).pow(new BN(KUSAMA_DECIMAL).sub(new BN(4))))
      if (uni >= 1e22) {
        uni = uni.div(new BN(1e18));
        unit = " E";
      } else if (uni >= 1e19) {
        uni = uni.div(new BN(1e15));
        unit = " P";
      } else if (uni >= 1e16) {
        uni = uni.div(new BN(1e12));
        unit = " T";
      } else if (uni >= 1e13) {
        uni = uni.div(new BN(1e9));
        unit = " B";
      } else if (uni >= 1e10) {
        uni = uni.div(new BN(1e6));
        unit = " M";
      } else if (uni >= 1e7) {
        uni = uni.div(new BN(1e3))
        unit = " K" 
      }
      return [uni, unit];
    },

    formatBanlance(value) {
      if (!value) return ["0.", "0000"];
      const str = parseFloat(value / 1e4).toFixed(4).toString();
      const integer = str.split(".")[0];
      const fraction = str.split(".")[1];
      return [integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ".", fraction];
    },
  },
};
</script>

<style lang="less" scoped>
</style>