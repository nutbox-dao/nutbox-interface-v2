<template>
  <div class="page-view-content wallet">
    <div class="page-view-title">{{ this.$t("wallet.wallet") }}</div>
    <div class="page-view-subtitle">Choose asset type</div>
    <div class="nav-box container" ref="navBox">
      <div class="nav mr-5">
        <router-link to="/wallet/polkadot" exact>Polkadot</router-link>
        <router-link to="/wallet/kusama">Kusama</router-link>
        <router-link to="/wallet/steem">Steem</router-link>
        <router-link v-if="isDebug" to="/wallet/rococo">Rococo</router-link>
      </div>
      <component :is="$route.name"></component>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { DEBUG } from '@/config'
import SteemAccount from '@/components/Accounts/SteemAccount'
import PolkadotAccount from '@/components/Accounts/PolkadotAccount'
export default {
  name: 'Wallet',
  components: {
    PolkadotWallet: PolkadotAccount,
    SteemWallet: SteemAccount
  },
  data () {
    return {
      showLogout: false,
      isDebug: DEBUG
    }
  },
  computed: {
  },
  methods: {
  },
  mounted () {
    console.log(this.$route)
  }
}
</script>

<style lang="less" scoped>
</style>
