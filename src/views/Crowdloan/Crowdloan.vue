<template>
  <div class="crowdloan">
    <h3>
      {{ this.$t("cl.crowdloan") }}
    </h3>
    <div class="nav sub-page-nav">
      <router-link to="/crowdloan/polkadot">Polkadot</router-link>
      <router-link to="/crowdloan/kusama">Kusama</router-link>
      <router-link v-if="isDebug" to="/crowdloan/rococo">Rococo</router-link>

      <div class="center-blank"></div>
    </div>
    <router-view></router-view>
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
  mounted() {},
};
</script>

<style lang="less" scoped>
.sub-page-nav {
  margin-bottom: 0.5rem;
}
</style>
