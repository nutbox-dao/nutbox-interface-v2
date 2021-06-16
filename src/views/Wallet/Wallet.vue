<template>
  <div class="page-view-content wallet">
    <div class="page-view-title">{{ this.$t("wallet.wallet") }}</div>
    <div class="page-view-subtitle">Choose asset type</div>
    <div class="nav">
      <router-link to="/wallet/polkadot" exact>Polkadot</router-link>
      <router-link to="/wallet/kusama">Kusama</router-link>
      <router-link v-if="isDebug" to="/wallet/rococo">Rococo</router-link>
    </div>
    <div class="scroll-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { DEBUG } from '@/config'
export default {
  name: 'Wallet',
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
  mounted () {}
}
</script>

<style lang="less" scoped>
</style>
