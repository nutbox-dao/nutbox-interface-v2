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
export default {
  name: 'DCrowdStaking'
}
</script>

<style scoped>

</style>
