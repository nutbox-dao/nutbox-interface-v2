<template>
  <div class="page-view-content crowdloan">
    <div class="page-view-title mt-2 mb-2">{{$t("cl.crowdloan") }}</div>
    <div class="nav-box">
      <div class="nav">
        <!--      <router-link to="/crowdloan" exact>Kusama</router-link>-->
        <router-link to="/crowdloan/polkadot">Polkadot</router-link>
        <router-link to="/crowdloan/kusama">Kusama</router-link>
        <router-link v-if="isDebug" to="/crowdloan/rococo">Rococo</router-link>

        <div class="center-blank"></div>
      </div>
    </div>
    <div class="scroll-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { DEBUG } from "@/config"
export default {
  name: "Crowdloan",
  data() {
    return {
      isDebug: DEBUG
    };
  },
  computed: {
  },
  methods: {
  },
  mounted () {}
}
</script>

<style lang="scss" scoped>
.crowdloan {
  position: relative;
}
</style>
