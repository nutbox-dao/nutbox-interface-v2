<template>
  <div class="page-container">
    <template v-if="$route.meta.slideBar">
      <div class="page-view-sidebar">
        <b-nav vertical>
          <b-nav-item to="/community/community-list">Community List</b-nav-item>
          <b-nav-item to="/community/community-token">Community Tokens</b-nav-item>
        </b-nav>
      </div>
      <div class="side-page-view-content">
        <router-view></router-view>
      </div>
    </template>
    <template v-else>
      <router-view></router-view>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Index'
}
</script>

<style scoped>

</style>
