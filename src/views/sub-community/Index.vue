<template>
  <div class="container h-100">
    <div class="sub-community-page">
      <div class="sub-page-side">
        <div class="slider-content">
          <div class="menu-items">
            <b-nav vertical align="center" class="top">
              <b-nav-item :to="'/sub-community/home/' + (communityId ? communityId.substring(0,10) : '')">
                <i class="menu-icon home-icon" />
                <span>Home</span>
              </b-nav-item>
              <b-nav-item to="/sub-community/staking">
                <i class="menu-icon stake-icon" />
                <span>{{ $t("router.staking") }}</span>
              </b-nav-item>
              <b-nav-item v-if="communityInfo && communityInfo.npsId" to="/sub-community/governance">
                <i class="menu-icon governance-icon" />
                <span>{{ $t("router.governance") }}</span>
              </b-nav-item>
              <b-nav-item to="/sub-community/member">
                <i class="menu-icon member-icon" />
                <span>{{ $t("router.member") }}</span>
              </b-nav-item>
            </b-nav>
          </div>
          <div class="link-items">
            <img class="hover" v-if="communityInfo && communityInfo.github" src="~@/static/images/h-github.svg" @click="openTab(communityInfo.github)" alt="">
            <img class="hover" v-if="communityInfo && communityInfo.document" src="~@/static/images/h-docs.svg" @click="openTab(communityInfo.document)" alt="">
            <img class="hover" v-if="communityInfo && communityInfo.facebook" src="~@/static/images/h-github.svg" @click="openTab(communityInfo.facebook)" alt="">
            <img class="hover" v-if="communityInfo && communityInfo.discord" src="~@/static/images/h-discord.svg" @click="openTab(communityInfo.discord)" alt="">
            <img class="hover" v-if="communityInfo && communityInfo.telegram" src="~@/static/images/h-telegram.svg" @click="openTab(communityInfo.telegram)" alt="">
            <img class="hover" v-if="communityInfo && communityInfo.twitter" src="~@/static/images/h-twitter.svg" @click="openTab(communityInfo.twitter)" alt="">
          </div>
        </div>
      </div>
      <div class="sub-page-container">
        <div class="sub-page-header view-top-header-sticky px-2 py-3">
          <b-dropdown variant="text" class="setting-dropdown" toggle-class="p-0">
            <template #button-content>
              <img class="menu-toggle ml-2"
                   src="~@/static/images/menu-icon.svg" alt=""/>
            </template>
            <template #default>
              <div class="slider-content">
                <div class="menu-items">
                  <b-dropdown-item :to="'/sub-community/home' + (communityId ? communityId.substring(0,10): '')">
                    <i class="menu-icon home-icon" />
                    <span>Home</span>
                  </b-dropdown-item>
                  <b-dropdown-item to="/sub-community/staking">
                    <i class="menu-icon stake-icon" />
                    <span>{{ $t("router.staking") }}</span>
                  </b-dropdown-item>
                  <b-nav-item to="/sub-community/governance">
                    <i class="menu-icon governance-icon" />
                    <span>{{ $t("router.governance") }}</span>
                  </b-nav-item>
                  <b-nav-item to="/sub-community/member">
                    <i class="menu-icon member-icon" />
                    <span>{{ $t("router.member") }}</span>
                  </b-nav-item>
                  <div class="link-items">
                    <img v-if="communityInfo && communityInfo.github" src="~@/static/images/h-github.svg" @click="openTab(communityInfo.github)" alt="">
                    <img v-if="communityInfo && communityInfo.document" src="~@/static/images/h-docs.svg" @click="openTab(communityInfo.document)" alt="">
                    <img v-if="communityInfo && communityInfo.facebook" src="~@/static/images/h-github.svg" @click="openTab(communityInfo.facebook)" alt="">
                    <img v-if="communityInfo && communityInfo.discord" src="~@/static/images/h-discord.svg" @click="openTab(communityInfo.discord)" alt="">
                    <img v-if="communityInfo && communityInfo.telegram" src="~@/static/images/h-telegram.svg" @click="openTab(communityInfo.telegram)" alt="">
                    <img v-if="communityInfo && communityInfo.twitter" src="~@/static/images/h-twitter.svg" @click="openTab(communityInfo.twitter)" alt="">
                  </div>
                </div>
              </div>
            </template>
          </b-dropdown>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import { getSpecifyCommunityInfo } from '@/utils/graphql/community'
import { handleApiErrCode } from '@/utils/helper';
import { getCToken } from '@/utils/web3/asset';

export default {
  name: 'Index',
  computed: {
    ...mapState(
      'currentCommunity', ['communityId']
    ),
    ...mapGetters('community', ['getCommunityInfoById']),
    communityInfo() {
      if(this.communityId) {
        const info = this.getCommunityInfoById(this.communityId)
        if (info){
          return info
        }
      }
      return {}
    },

  },
  data () {
    return {
      loading: false
    }
  },
  mounted () {
    if (!this.communityId) {
      this.$router.replace('/');
      return;
    }
    try {
      this.loading = true;
      getSpecifyCommunityInfo(this.communityId).then(community => {
        getCToken(community.id, true).then(ctoken => {
          this.saveCtoken(ctoken)
        }).catch(e => {
          console.log('get ctoken fail');
        })
        this.saveFeeRatio(community.feeRatio)
        this.saveOperationCount(community.operationCount)
        this.saveAllPools(community.pools)
        this.saveOperationHistory(community.operationHistory)
        this.saveAllUsers(community.users)
        this.loading = false
      }).catch(e => {
        console.log(42643, e)
      })
    }catch (e){
      handleApiErrCode(e, (tip, params) => {
        this.$bvToast.toast(tip, params)
      })
      this.loading = false
    }
  },
  beforeDestroy() {
    this.clearData()
    this.clear();
  },
  methods: {
    ...mapMutations('currentCommunity', [
      'clearData',
      'saveCtoken',
      'saveAllPools',
      'saveFeeRatio',
      'saveOperationCount',
      'saveOperationHistory',
      'saveAllUsers']),
      ...mapMutations('pool', ['clear']),
      openTab(url) {
        window.open(url, '_blank')
      }
  },
}
</script>

<style scoped lang="scss">
.sub-community-page {
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
}
.sub-page-container {
  height: 100%;
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
}
.menu-toggle {
  width: 1.6rem;
}
.sub-page-side {
  width: 12rem;
  height: 100%;
  padding: 0 .8rem .8rem;
}
.slider-content {
  width: 100%;
  height: 100%;
  background-color: var(--card-bg-primary);
  padding: 1rem 0;
  border-radius: .8rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .menu-items {
    .nav-link {
      display: flex;
      align-items: center;
    }
    i {
      margin-right: .5rem;
      opacity: .8;
    }
    span {
      color: var(--text-grey-7);
    }
    .active span {
      color: var(--primary-custom);
      font-weight: bold;
    }
    .active i {
      opacity: 1;
    }
  }
  .link-items {
    display: flex;
    flex-flow: wrap;
    justify-content: center;
    img {
      margin: 0.5rem;
    }
  }
}
@media (min-width: 1200px) {
  .sub-page-side {
    width: 16rem;
  }
}
@media (min-width: 992px) {
  .sub-page-side {
    display: block;
  }
  .sub-page-header {
    display: none;
  }
}
@media (max-width: 991px) {
  .sub-page-side {
    display: none;
  }
  .sub-page-header {
    display: block;
    z-index: 9;
  }
  .sub-page-container {
    display: flex;
    flex-direction: column;
  }
}
.menu-icon {
  @include icon(1.2rem, 1.2rem);
}
.home-icon {
  background-image: url("~@/static/images/menu-home.svg");
}
.blog-icon {
  background-image: url("~@/static/images/menu-blog.svg");
}
.stake-icon {
  background-image: url("~@/static/images/menu-stake.svg");
}
.dapp-icon {
  background-image: url("~@/static/images/menu-dapp.svg");
}
.governance-icon {
  background-image: url("~@/static/images/menu-governance.svg");
}
.member-icon {
  background-image: url("~@/static/images/menu-member.svg");
}
.active {
  .home-icon {
    background-image: url("~@/static/images/menu-home-active.svg");
  }
  .blog-icon {
    background-image: url("~@/static/images/menu-blog.svg");
  }
  .stake-icon {
    background-image: url("~@/static/images/menu-stake-active.svg");
  }
  .dapp-icon {
    background-image: url("~@/static/images/menu-dapp.svg");
  }
  .governance-icon {
    background-image: url("~@/static/images/menu-governance-active.svg");
  }
  .member-icon {
    background-image: url("~@/static/images/menu-member-active.svg");
  }
}
</style>
