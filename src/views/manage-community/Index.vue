<template>
  <div class="container h-100">
    <div class="manage-index-page">
      <div class="m-menu">
        <div class="m-menu-card font16 line-height16">
          <b-nav vertical class="overflow-hidden">
            <b-nav-item to="/manage-community/profile">
              <i class="menu-icon home-icon" />
              <span>{{ $t('router.information') }}</span>
            </b-nav-item>
            <b-nav-item to="/manage-community/asset">
              <i class="menu-icon asset-icon" />
              <span>{{ $t('router.asset') }}</span>
            </b-nav-item>
            <b-nav-item to="/manage-community/staking">
              <i class="menu-icon stake-icon" />
              <span>{{ $t('router.pool') }}</span>
            </b-nav-item>
            <b-nav-item to="/manage-community/social">
              <i class="menu-icon social-icon" />
              <span>{{ $t('router.social') }}</span>
            </b-nav-item>
            <b-nav-item to="/manage-community/vote">
              <i class="menu-icon governance-icon" />
              <span>{{ $t('router.governance') }}</span>
            </b-nav-item>
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
import { getMyCommunityContract, getApprovement } from '@/utils/web3/community'
import { NutAddress } from '@/config'

export default {
  name: 'Index',
  async mounted () {
    try{
      const res = await getMyCommunityContract()
      getMyCommunityData();
      this.$store.commit('community/saveLoadingApproveCommunity', true)

      getApprovement(NutAddress, res).then(res => {
        this.$store.commit('community/saveApprovedCommunity', res)
      }).finally(() => {
        this.$store.commit('community/saveLoadingApproveCommunity', false)
      })
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
    width: 170px;
    height: calc(100% - 16px);
    margin-right: 16px;
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
  @include card(12px 0);
  width: 100%;
  .nav-item {
    width: 100%;
  }
  .nav-item a{
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--text-74);
    display: flex;
    align-items: center;
    padding: 12px 20px;
    user-select: none;
    &.active {
      color: var(--primary-custom);
      font-weight: bold;
    }
  }
}
.menu-icon {
  @include icon(24px, 24px);
  margin-right: .4rem;
}
.home-icon {
  background-image: url("~@/static/images/m-menu-home.svg");
}
.asset-icon {
  background-image: url("~@/static/images/m-menu-asset.svg");
}
.stake-icon {
  background-image: url("~@/static/images/m-menu-stake.svg");
}
.governance-icon {
  background-image: url("~@/static/images/m-menu-governance.svg");
}
.social-icon {
  background-image: url("~@/static/images/m-menu-social.svg");
}
.active {
  .home-icon {
    background-image: url("~@/static/images/m-menu-home-active.svg");
  }
  .asset-icon {
    background-image: url("~@/static/images/m-menu-asset-active.svg");
  }
  .stake-icon {
    background-image: url("~@/static/images/m-menu-stake-active.svg");
  }
  .governance-icon {
    background-image: url("~@/static/images/m-menu-governance-active.svg");
  }
  .social-icon {
    background-image: url("~@/static/images/m-menu-social-active.svg");
  }
}
</style>
