<template>
  <div class="ksm-wallet">
    <div class="balance-box row">
      <div class="col-xl-4 col-md-6 mb-4">
        <BalanceView
          name="DOT"
          :balances="available / 1e10"
          desc="DOT"
          :logo="dotLogo"
          :transfer="true"
        />
      </div>
      <div class="col-xl-4 col-md-6 mb-4">
        <LockedBalanceView
          name="DOT"
          :balances="locked / 1e10"
          desc="Locked DOT"
          :logo="dotLogo"
          :transfer="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import BalanceView from "@/components/Wallet/Polkadot/BalanceView";
import LockedBalanceView from "@/components/Wallet/Polkadot/LockedBalanceView";
import { mapState, mapGetters } from "vuex";
import { subNominators } from '@/utils/commen/crowdStaking'

export default {
  data() {
    return {
      dotLogo: require("../../static/images/tokens/dot.png"),
    };
  },
  computed: {
    ...mapState("polkadot", ["balance", "locked"]),
    ...mapGetters("polkadot", ["available"]),
  },
  components: {
    BalanceView,
    LockedBalanceView
  },
  async mounted() {
    subNominators('polkadot')
  },
};
</script>

<style lang="less" scoped>

</style>
