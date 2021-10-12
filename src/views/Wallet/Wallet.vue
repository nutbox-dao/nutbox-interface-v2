<template>
  <div class="page-view-content wallet">
    <div class="container scroll-content">
      <div class="page-view-title-v">{{ $t("wallet.wallet") }}</div>
      <div class="view-top-header p-view-top-header flex-between-center">
        <div class="nav-box nav-box-bg" ref="navBox">
          <div class="nav">
            <router-link to="bsc">BSC</router-link>
            <router-link to="polkadot">Polkadot</router-link>
            <router-link to="kusama">Kusama</router-link>
            <router-link to="steem">Steem</router-link>
            <router-link to="hive">Hive</router-link>
          </div>
        </div>
        <component :is="$route.name"></component>
      </div>
      <div class="view-top-header view-top-header-sticky m-view-top-header flex-between-center">
        <b-dropdown class="top-header-dropdown" no-caret>
          <template #button-content>
            <span>{{$route.name}}</span>
            <i class="dropdown-icon ml-2"></i>
          </template>
          <b-dropdown-item to="bsc" exact>BSC</b-dropdown-item >
          <b-dropdown-item to="polkadot">Polkadot</b-dropdown-item >
          <b-dropdown-item to="kusama">Kusama</b-dropdown-item >
          <b-dropdown-item to="steem">Steem</b-dropdown-item >
          <b-dropdown-item to="hive">Hive</b-dropdown-item >
        </b-dropdown>
        <component :is="$route.name"></component>
      </div>
      <router-view></router-view>
    </div>
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
