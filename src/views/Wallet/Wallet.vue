<template>
  <div class="page-view-content wallet">
    <div class="page-view-title">{{ this.$t("wallet.wallet") }}</div>
    <!-- <div class="page-view-subtitle">Choose asset type</div> -->
    <div class="nav-box container" ref="navBox">
      <div class="nav mr-5">
        <router-link to="/wallet/bsc" exact>BSC</router-link>
        <router-link to="/wallet/polkadot">Polkadot</router-link>
        <router-link to="/wallet/kusama">Kusama</router-link>
        <router-link to="/wallet/steem">Steem</router-link>
        <router-link to="/wallet/hive">Hive</router-link>
      </div>
      <component :is="$route.name"></component>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import SteemAccount from '@/components/Accounts/SteemAccount'
import HiveAccount from '@/components/Accounts/HiveAccount'
import PolkadotAccount from '@/components/Accounts/PolkadotAccount'
import BSCAccount from '@/components/Accounts/BSCAccount'

export default {
  name: 'Wallet',
  components: {
    PolkadotWallet: PolkadotAccount,
    SteemWallet: SteemAccount,
    BSCWallet: BSCAccount,
    HiveWallet: HiveAccount
  },
  computed: {
  },
  methods: {
  },
  mounted () {
    console.log(this.$route.name)
  }
}
</script>

<style lang="less" scoped>
</style>
