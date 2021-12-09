<template>
  <div class="m-menu-card">
    <b-nav vertical class="overflow-hidden">
      <b-nav-item to="/manage-community/profile">{{ $t('community.communityInfo') }}</b-nav-item>
      <b-nav-item to="/manage-community/asset">{{ $t('asset.asset') }}</b-nav-item>
      <b-nav-item to="/manage-community/staking">{{ $t('community.pool') }}</b-nav-item>
      <b-nav-item to="/manage-community/social">{{ $t('community.social') }}</b-nav-item>
      <b-nav-item to="/manage-community/vote">{{ $t('nps.nps') }}</b-nav-item>
<!--      <b-nav-item to="/manage-community/game">{{ $t('game.game') }}</b-nav-item>-->
    </b-nav>
  </div>
</template>

<script>
export default {
  name: 'ManageCommunityMenu'
}
</script>

<style scoped lang="scss">
.m-menu-card {
  @include card(1.2rem 0);
  width: 10rem;
  .nav-item {
    width: 100%;
  }
  .nav-item a{
    overflow: hidden;
    text-overflow: ellipsis;
    color: rgba(white, .7);
    &.active {
      color: white;
      font-weight: bold;
    }
  }
}
</style>
