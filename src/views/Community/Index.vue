<template>
  <div class="page-container">
    <template v-if="$route.meta.slideBar">
      <div class="page-view-sidebar">
        <b-nav vertical>
          <b-nav-item to="/community/community-list">{{ $t('community.communityList') }}</b-nav-item>
          <b-nav-item to="/community/community-token">{{ $t('community.communityTokenList') }}</b-nav-item>
        </b-nav>
      </div>
      <div class="side-page-view-content">
        <div class="container">
          <div class="view-top-header m-view-top-header flex-between-center">
            <div class="nav-box nav-box-bg">
              <div class="nav">
                <b-nav-item to="/community">{{ $t('community.communityList') }}</b-nav-item>
                <b-nav-item to="#">{{ $t('community.communityTokenList') }}</b-nav-item>
              </div>
            </div>
          </div>
        </div>
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
