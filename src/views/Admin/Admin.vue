<template>
  <div class="page-view-content admin">
    <div class="page-view-title">{{$t("admin.admin") }}</div>
    <div class="nav">
      <router-link to="/admin" exact>Pokadot</router-link>
      <router-link to="/admin/kusama">Kusama</router-link>
      <div class="center-blank"></div>
    </div>
    <div class="scroll-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Wallet",
  data() {
    return {
      showLogout: false,
    };
  },
  computed: {

  },
  methods: {
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
</style>
