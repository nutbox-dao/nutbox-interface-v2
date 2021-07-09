<template>
  <div class="page-view-content register">
    <div class="view-top-header mb-2">
      <div class="page-back-text-icon page-view-title" @click="$router.back()">
        {{ $t('asset.registerTitle') }}
      </div>
    </div>
    <!-- <div class="page-view-subtitle">Choose asset type</div> -->
    <div class="nav-box">
      <div class="nav">
        <router-link to="/community/register/native"
        >{{ $t('asset.native') }}</router-link
        >
        <router-link to="/community/register/cross-chain-asset"
        >{{ $t('asset.foreign') }}</router-link
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
