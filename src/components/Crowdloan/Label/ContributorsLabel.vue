<template>
  <div>
    <span class="text-grey-light">
      {{ percent + " " }}
    </span>
    <span>
      {{ " " + getFundInfo && getFundInfo.funds.length + " " }}
    </span>
    <span class="text-grey-light"> contributors </span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    paraId: {
      type: Number,
    },
  },
  computed: {
    ...mapGetters('kusama', ["fundInfo"]),
    getFundInfo() {
      return this.fundInfo(this.paraId);
    },
    
    percent() {
      if (!this.getFundInfo) return;
      return (
        this.getFundInfo.cap.isZero()
        ? "100.00%"
        : (this.getFundInfo.raised.muln(10000).div(this.getFundInfo.cap).toNumber() / 100).toFixed(2) + "% "
      );
    },
  },
};
</script>

<style lang="less" scoped>
</style>