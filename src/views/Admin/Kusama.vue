<template>
  <div class="contribution-page">
    <div class="font20 font-bold mt-3 mb-3 text-left">{{ $t('cl.crowdloan') }}</div>
    <Crowdloan chain='kusama'/>
    <div class="font20 font-bold mt-3 mb-3 text-left">{{ $t('cs.crowdstaking') }}</div>
    <Crowdstaking chain='kusama'/>
  </div>
</template>

<script>
import Crowdloan from "@/components/Admin/CrowdloanDashboardCard.vue";
import Crowdstaking from "@/components/Admin/CrowdstakingDashboardCard.vue"

export default {
  name: "Dashboard",
  components: {
    Crowdloan,
    Crowdstaking
  },
  data() {
    return {
      cards:[]
    };
  },
};
</script>

<style scoped lang="scss">
</style>
