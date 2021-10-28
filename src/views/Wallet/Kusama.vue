<template>
  <div class="ksm-wallet">
    <div class="ksm-wallet">
      <div class="balance-box row">
        <div class="col-xl-4 col-md-6 mb-4">
          <BalanceView
            name="KSM"
            :balances="available / 1e12"
            desc="KSM"
            :logo="ksmLogo"
            :transfer="true"
          />
        </div>
        <div class="col-xl-4 col-md-6 mb-4">
          <LockedBalanceView
            name="KSM"
            :balances="locked / 1e12"
            desc="Locked KSM"
            :logo="ksmLogo"
            :transfer="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BalanceView from "@/components/Wallet/Kusama/BalanceView";
import LockedBalanceView from "@/components/Wallet/Kusama/LockedBalanceView";
import { mapState, mapGetters } from "vuex";
import { subNominators } from '@/utils/commen/crowdStaking'
import { initApis } from '@/utils/commen/api'

export default {
  data() {
    return {
      ksmLogo: require("../../static/images/tokens/ksm.png"),
    };
  },
  computed: {
    ...mapState("kusama", ["balance", "locked"]),
    ...mapGetters("kusama", ["available"]),
  },
  components: {
    BalanceView,
    LockedBalanceView
  },
  async mounted() {
    initApis('kusama');
    subNominators('kusama');
  },
};
</script>

<style lang="scss" scoped>
</style>
