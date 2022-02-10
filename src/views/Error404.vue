<template>
  <div class="text-center pt-5">
    <img src="@/static/images/404.svg" alt="graphic-404" class="mx-auto mb-4" style="width: 60%; max-width: 20rem">
    <div class="font24 mb-4 font-bold">Page Not Found!</div>
    <router-link to="/">
      <button class="primary-btn" style="width: fit-content">Back to Home</button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Error404'
}
</script>

<style scoped>

</style>
