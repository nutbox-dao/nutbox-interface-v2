<template>
  <div class="row">
    <div class="col-xl-4 col-md-6 mb-4" v-for="i of 8" :key="i">
      <SteemCard/>
    </div>
  </div>
</template>

<script>
import SteemCard from '@/components/Wallet/cards/SteemCard'
export default {
  name: 'Steem',
  components: { SteemCard }
}
</script>

<style scoped>

</style>
