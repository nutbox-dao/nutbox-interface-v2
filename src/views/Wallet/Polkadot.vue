<template>
  <div class="ksm-wallet">
    <div class="ksm-wallet">
      <p class="item-title">
        {{ $t("wallet.asset") }}
      </p>
      <div class="balance-box">
        <BalanceView
          name="DOT"
          :balances="available / 1e10"
          desc="DOT"
          :logo="dotLogo"
          :transfer="true"
        />
        <LockedBalanceView
          name="DOT"
          :balances="locked / 1e10"
          desc="Locked DOT"
          :logo="dotLogo"
          :transfer="true"
        />
      </div>
      <p class="item-title">
        {{ $t("wallet.nomination") }}
      </p>
      <UserNominations />
    </div>
  </div>
</template>

<script>
import BalanceView from "@/components/Wallet/Polkadot/BalanceView";
import LockedBalanceView from "@/components/Wallet/Polkadot/LockedBalanceView";
import { mapState, mapGetters } from "vuex";
import UserNominations from "@/components/Wallet/Polkadot/UserNominations";

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
    UserNominations,
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
