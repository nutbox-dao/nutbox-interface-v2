<template>
  <div class="position-relative">
    <div class="m-menu">
      <ManageCommunityMenu/>
    </div>
    <div class="m-page">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import ManageCommunityMenu from '@/components/community/ManageCommunityMenu'
export default {
  name: 'Index',
  components: { ManageCommunityMenu }
}
</script>

<style scoped lang="scss">
.m-menu {
  position: absolute;
  left: .8rem;
}
@media (min-width: 992px) {
  .m-page {
    margin: 0 11.6rem;
  }
}
@media (max-width: 991px) {
  .m-menu {
    display: none;
  }
}
</style>
