<template>
  <div class="page-container">
    <template v-if="$route.meta.slideBar">
      <div class="page-view-sidebar">
        <b-nav vertical>
          <b-nav-item to="/community-setting/profile">Profile</b-nav-item>
          <b-nav-item to="/community-setting/asset">Asset</b-nav-item>
          <b-nav-item to="/community-setting/staking">Staking</b-nav-item>
          <b-nav-item to="/community-setting/social">Social</b-nav-item>
          <b-nav-item to="/community-setting/vote">Vote</b-nav-item>
        </b-nav>
      </div>
      <div class="side-page-view-content">
        <div class="container">
          <div class="view-top-header m-view-top-header flex-between-center">
            <div class="nav-box nav-box-bg">
              <div class="nav">
                <b-nav-item to="/community-setting/profile">Profile</b-nav-item>
                <b-nav-item to="/community-setting/asset">Asset</b-nav-item>
                <b-nav-item to="/community-setting/staking">Staking</b-nav-item>
                <b-nav-item to="/community-setting/social">Social</b-nav-item>
                <b-nav-item to="/community-setting/vote">Vote</b-nav-item>
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
  name: 'Index',
  data () {
    return {
      isCreate: true
    }
  },
  watch: {
    '$route.name' () {
      console.log(this.$route.name)
    }
  },
  mounted () {
    console.log(this.$route)
    if (this.$route.name === 'community-setting') {
      this.$router.push(this.isCreate ? '/community-setting/profile' : '/community-setting/tutorials')
    }
  }
}
</script>

<style scoped lang="scss">
.view-top-header {
  overflow-x: auto;
}
.m-view-top-header {
  padding-bottom: 0;
}
</style>
