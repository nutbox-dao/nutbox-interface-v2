<template>
  <div class="ksm-wallet">
    <div class="ksm-wallet">
      <p class="item-title">
        {{ $t("wallet.asset") }}
      </p>
      <div class="balance-box">
        <BalanceView
          name="KSM"
          :balances="available / 1e12"
          desc="KSM"
          :logo="ksmLogo"
          :transfer="true"
        />
        <LockedBalanceView
          name="KSM"
          :balances="locked / 1e12"
          desc="Locked KSM"
          :logo="ksmLogo"
          :transfer="true"
        />
      </div>
      <p class="item-title">
        {{ $t("wallet.contribution") }}
      </p>
      <UserContributions />
    </div>
  </div>
</template>

<script>
import BalanceView from "@/components/Wallet/Kusama/BalanceView";
import LockedBalanceView from "@/components/Wallet/Kusama/LockedBalanceView";
import UserContributions from "@/components/Wallet/Kusama/UserContributions";
import { mapState, mapGetters } from "vuex";

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
    UserContributions,
    LockedBalanceView,
  },
  async mounted() {},
};
</script>

<style lang="less" scoped>
.ksm-wallet {
  margin-top: 20px;
  .balance-box {
    display: flex;
    align-content: left;
    // z-index: 1;
    // justify-content: space-between;
    flex-wrap: wrap;
    > div {
      margin-top: 24px;
      margin-right: 24px;
    }
  }
}
</style>
