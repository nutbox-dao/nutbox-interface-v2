<template>
  <div>
    <span class="text-grey-light">
      {{ percent + " " }}
    </span>
    <span>
      {{ " " + (fund ? (fund.funds.count | 0): 0) + " " }}
    </span>
    <span class="text-grey-light"> {{ lang === 'en' ? 'Contributors' : '人投票' }} </span>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    fund: {
      type: Object,
    }
  },
  computed: {
    ...mapState(['lang']),
    
    percent() {
      if (!this.fund || Object.keys(this.fund).length === 0) return '0%';
      return (
        this.fund.cap.isZero()
        ? "100.00%"
        : (this.fund.raised.muln(10000).div(this.fund.cap).toNumber() / 100).toFixed(2) + "% "
      );
    },
  },
};
</script>

<style lang="less" scoped>
</style>