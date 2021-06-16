<template>
  <div class="contribution-page">
    <div class="font20 mt-3 mb-3 text-left">{{ $t('cl.crowdloan') }}</div>
    <Crowdloan chain="polkadot"/>
    <div class="font20 mt-3 mb-3 text-left">{{ $t('cs.crowdstaking') }}</div>
    <DashboardCard chain="polkadot"/>
  </div>
</template>

<script>
import DashboardCard from "@/components/Admin/CrowdstakingDashboardCard.vue";
import Crowdloan from "@/components/Admin/CrowdloanDashboardCard.vue"

export default {
  name: "Dashboard",
  components: {
    DashboardCard,
    Crowdloan
  },
  data() {
    return {
      cards:[]
    };
  },
};
</script>

<style scoped lang="less">
</style>
