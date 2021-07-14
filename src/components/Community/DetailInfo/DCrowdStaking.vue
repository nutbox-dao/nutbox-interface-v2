<template>
  <div class="row">
    <div
      class="col-xl-4 col-md-6 mb-4"
      v-for="idx of 4"
      :key="idx"
    >
      <MiningCard chain=""/>
    </div>
  </div>
</template>

<script>
import MiningCard from '@/components/Community/MiningCard'
export default {
  name: 'DCrowdStaking',
  components: { MiningCard }
}
</script>

<style scoped>

</style>
