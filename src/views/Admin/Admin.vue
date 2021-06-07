<template>
  <div class="admin">
    <div class="page-view-title">{{$t("admin.admin") }}</div>
    <div class="nav">
      <router-link to="/admin" exact>Pokadot</router-link>
      <router-link to="/admin/kusama">Kusama</router-link>
      <div class="center-blank"></div>
    </div>
    <router-view></router-view>
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
