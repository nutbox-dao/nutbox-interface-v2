<template>
  <div class="page-view-content register">
    <div class="view-top-header mb-2">
      <div class="page-back-text-icon page-view-title" @click="$router.back()">
        Register Your Asset On Nutbox
      </div>
    </div>
    <!-- <div class="page-view-subtitle">Choose asset type</div> -->
    <div class="nav-box">
      <div class="nav">
        <router-link to="/community/register/native"
        >Native Asset Only</router-link
        >
        <router-link to="/community/register/cross-chain-asset"
        >Cross-chain Binding Asset</router-link
        >
      </div>
    </div>
    <div class="scroll-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
};
</script>

<style scoped lang="scss">
</style>
