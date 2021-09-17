<template>
  <div class="page-view-content wallet">
    <div class="container scroll-content">
      <div class="view-top-header p-view-top-header flex-between-center">
        <div class="nav-box nav-box-bg" ref="navBox">
          <div class="nav mr-5">
            <router-link to="/wallet/bsc" exact>BSC</router-link>
            <router-link to="/wallet/polkadot">Polkadot</router-link>
            <router-link to="/wallet/kusama">Kusama</router-link>
            <router-link to="/wallet/steem">Steem</router-link>
            <router-link to="/wallet/hive">Hive</router-link>
          </div>
        </div>
        <component :is="$route.name"></component>
      </div>
      <div class="view-top-header m-view-top-header flex-between-center">
        <b-dropdown class="top-header-dropdown" no-caret>
          <template #button-content>
            <span>{{$route.name}}</span>
            <i class="dropdown-icon ml-2"></i>
          </template>
          <b-dropdown-item to="/wallet/bsc" exact>BSC</b-dropdown-item >
          <b-dropdown-item to="/wallet/polkadot">Polkadot</b-dropdown-item >
          <b-dropdown-item to="/wallet/kusama">Kusama</b-dropdown-item >
          <b-dropdown-item to="/wallet/steem">Steem</b-dropdown-item >
          <b-dropdown-item to="/wallet/hive">Hive</b-dropdown-item >
        </b-dropdown>
        <b-dropdown class="top-header-dropdown" right no-caret>
          <template #button-content>
            <span>{{tabOptions[activeTab]}}</span>
            <i class="dropdown-icon ml-2"></i>
          </template>
          <b-dropdown-item v-for="(item, index) of tabOptions" :key="index"
                           :class="activeTab===index?'active':''"
                           @click="activeTab = index">{{item}}</b-dropdown-item>
        </b-dropdown>
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
