<template>
  <div class="container h-100">
    <div class="manage-index-page">
      <div class="m-menu">
        <ManageCommunityMenu/>
      </div>
      <div class="m-page">
        <router-view></router-view>
      </div>
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
      // this.$router.replace('/')
    }
  },
}
</script>

<style scoped lang="scss">
.manage-index-page {
  height: 100%;
  display: flex;
  .m-menu {
    height: fit-content;
    margin: 0 .8rem .8rem;
  }
  .m-page {
    flex: 1;
  }
}
@media (max-width: 767px) {
  .m-menu {
    display: none;
  }
}
</style>
