<template>
  <div class="page-view-content register">
    <div class="scroll-content container">
      <div class="view-top-header">
        <div class="page-back-text-icon page-view-title" @click="$router.back()">
          {{ $t('asset.registerTitle') }}
        </div>
        <div class="nav-box nav-box-line mt-3">
          <div class="nav">
            <router-link to="/community-setting/register/native" replace
            >{{ $t('asset.native') }}</router-link
            >
            <router-link to="/community-setting/register/cross-chain-asset" replace
            >{{ $t('asset.foreign') }}</router-link
            >
          </div>
        </div>
      </div>
      <div class="mb-5">
        <router-view></router-view>
      </div>
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
