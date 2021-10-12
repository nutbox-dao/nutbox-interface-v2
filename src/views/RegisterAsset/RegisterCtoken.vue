<template>
  <div class="page-view-content register">
    <div class="container scroll-content">
      <div class="view-top-header">
        <Step :current-step="1"></Step>
        <div class="page-back-text-icon page-view-title" @click="$router.back()">
          {{ $t('asset.registerCtokenTitle') }}
        </div>
      </div>
      <!-- <div class="page-view-subtitle">Choose asset type</div> -->
      <div class="mb-5" style="padding-top:3rem;">
        <NativeAsset/>
      </div>
    </div>
  </div>
</template>

<script>
import NativeAsset from './NativeAsset.vue'
import Step from "@/components/ToolsComponents/Step";

export default {
  name: "RegisterCtoken",
  components: {
    NativeAsset,
    Step
  },
};
</script>

<style scoped lang="scss">
</style>
