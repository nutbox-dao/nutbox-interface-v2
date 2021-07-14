<template>
  <div class="c-card">
    <div class="status-container text-right">
      <span :class="status">{{ $t('cl.'+status)}}</span>
    </div>
    <div class="card-title-box flex-start-center">
      <div class="card-single-icon mr-2">
        <img src="../../static/images/logo_small.png" alt="" />
      </div>
      <div class="card-link-title-text">
        <div class="title-text font20 font-bold text-left">
          <span>Community Link</span>
          <i class="link-icon"></i>
        </div>
      </div>
    </div>
    <div class="h-line mt-4 mb-2"></div>
    <div class="detail-info-box">
      <div class="project-info-container">
        <span class="name"> {{ $t("cl.leasePeriod") }} </span>
        <div class="info">--</div>
      </div>
      <div class="project-info-container">
        <span class="name"> {{ $t("cl.countDown") }} </span>
        <div class="info">--</div>
      </div>
    </div>
    <button class="primary-btn" :disabled="!isConnected">
      <b-spinner small type="grow" v-show="!isConnected"></b-spinner>
      {{ $t("cl.contribute") }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'MiningCard',
  props: {
    chain: String
  },
  data () {
    return {
      status: 'Completed'
    }
  },
  computed: {
    isConnected () {
      // return this.$store.state[this.chain].isConnected
      return true
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/static/css/card/common-card";
</style>
