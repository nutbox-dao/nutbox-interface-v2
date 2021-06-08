<template>
  <div class="page-view-content crowdloan">
    <div class="page-view-title">{{$t("cl.crowdloan") }}</div>
    <div class="nav">
      <router-link to="/crowdloan" exact>Kusama</router-link>
      <router-link to="/crowdloan/polkadot">Polkadot</router-link>
      <div class="center-blank"></div>
    </div>
    <div class="scroll-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Crowdloan',
  data () {
    return {
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
