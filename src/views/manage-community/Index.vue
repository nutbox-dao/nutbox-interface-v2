<template>
  <div class="container h-100">
    <div class="manage-index-page">
      <div class="m-menu">
        <div class="m-menu-card">
          <b-nav vertical class="overflow-hidden">
            <b-nav-item to="/manage-community/profile">{{ $t('router.information') }}</b-nav-item>
            <b-nav-item to="/manage-community/asset">{{ $t('router.asset') }}</b-nav-item>
            <b-nav-item to="/manage-community/staking">{{ $t('router.pool') }}</b-nav-item>
            <b-nav-item to="/manage-community/social">{{ $t('router.social') }}</b-nav-item>
            <b-nav-item to="/manage-community/vote">{{ $t('router.governance') }}</b-nav-item>
      <!--      <b-nav-item to="/manage-community/game">{{ $t('game.game') }}</b-nav-item>-->
          </b-nav>
        </div>
      </div>
      <div class="m-page">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { getMyCommunityData } from '@/utils/graphql/user'
import { getMyCommunityContract } from '@/utils/web3/community'

export default {
  name: 'Index',
  async mounted () {
    try{
      const res = await getMyCommunityContract()
      getMyCommunityData();
    }catch(e) {
      // no registered
      this.$router.replace('/')
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
.m-menu-card {
  @include card(1.2rem 0);
  width: 10rem;
  .nav-item {
    width: 100%;
  }
  .nav-item a{
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--text-74);
    &.active {
      color: var(--primary-custom);
      font-weight: bold;
    }
  }
}
</style>
