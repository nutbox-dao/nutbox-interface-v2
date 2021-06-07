<template>
  <div class="wallet">
    <div class="page-view-title">{{ $t("wallet.wallet") }}</div>
    <div class="nav">
      <router-link to="/wallet" exact>Pokadot</router-link>
      <router-link to="/wallet/kusama">Kusama</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Wallet',
  data () {
    return {
      showLogout: false
    }
  },
  computed: {
  },
  methods: {
  },
  mounted () {}
}
</script>

<style lang="scss" scoped>
//@import "src/static/css/card";
</style>
