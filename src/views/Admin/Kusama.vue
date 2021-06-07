<template>
  <div class="contribution-page">
    <div class="font20 font-bold mt-3 mb-3 text-left">{{ $t('cl.crowdloan') }}</div>
    <DashboardCard chain='KUSAMA'/>
  </div>
</template>

<script>
import DashboardCard from "@/components/Admin/CrowdloanDashboardCard.vue";

export default {
  name: "Dashboard",
  components: {
    DashboardCard,
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
