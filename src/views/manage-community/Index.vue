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
import { getMyCommunityData } from '@/utils/graphql/user'
import { getMyCommunityContract } from '@/utils/web3/community'

export default {
  name: 'Index',
  components: { ManageCommunityMenu },
  async mounted () {
    try{
      await getMyCommunityContract()
      getMyCommunityData();
    }catch(e) {
      // no registered
      this.$router.replace('/')
    }
  },
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
