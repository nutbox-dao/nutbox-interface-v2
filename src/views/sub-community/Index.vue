<template>
  <div class="container h-100">
    <div class="sub-community-page">
      <div class="sub-page-side">
        <div class="slider-content">
          <div class="menu-items">
            <b-nav vertical align="center" class="top">
              <b-nav-item to="/sub-community/home">
                <i class="menu-icon home-icon" />
                <span>Home</span>
              </b-nav-item>
              <b-nav-item to="/sub-community/home">
                <i class="menu-icon stake-icon" />
                <span>{{ $t("router.staking") }}</span>
              </b-nav-item>
              <b-nav-item to="/sub-community/home">
                <i class="menu-icon blog-icon" />
                <span>{{ $t("router.blog") }}</span>
              </b-nav-item>
            </b-nav>
          </div>
        </div>
      </div>
      <div class="sub-page-container">
        <div class="sub-page-header view-top-header-sticky px-2 py-3">
          <b-dropdown variant="text" class="setting-dropdown" toggle-class="p-0">
            <template #button-content>
              <img class="menu-toggle ml-2"
                   src="~@/static/images/menu-icon.svg" alt="" v-b-toggle.sidebar-menu/>
            </template>
            <template #default>
              <div class="slider-content">
                <div class="menu-items">
                  <b-nav vertical align="center" class="top">
                    <b-nav-item to="/sub-community/home">
                      <i class="menu-icon home-icon" />
                      <span>Home</span>
                    </b-nav-item>
                    <b-nav-item to="/sub-community/home">
                      <i class="menu-icon stake-icon" />
                      <span>{{ $t("router.staking") }}</span>
                    </b-nav-item>
                    <b-nav-item to="/sub-community/home">
                      <i class="menu-icon blog-icon" />
                      <span>{{ $t("router.blog") }}</span>
                    </b-nav-item>
                  </b-nav>
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
import { mapState, mapMutations } from 'vuex'
import { getSpecifyCommunityInfo } from '@/utils/graphql/community'
import { handleApiErrCode } from '@/utils/helper';
import { getCToken } from '@/utils/web3/asset';
export default {
  name: 'Index',
  computed: {
    ...mapState(
      'currentCommunity', ['communityId']
    )
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
    console.log("Specify community id", this.communityId);
    try {
      this.loading = true;
      getSpecifyCommunityInfo(this.communityId).then(community => {
        getCToken(community.id).then(ctoken => {
          console.log(1, community.id, ctoken);
          this.saveCtoken(ctoken)
        }).catch(e => {
          console.log('get ctoken fail');
        })
        this.saveFeeRatio(community.feeRatio)
        this.saveOperationCount(community.operationCount)
        this.saveAllPools(community.pools)
        this.saveOperationHistory(community.operationHistory)

        this.loading = false
      })
    }catch (e){
      handleApiErrCode(e, (tip, params) => {
        this.$bvToast.toast(tip, params)
      })
      this.loading = false
    }
  },
  methods: {
    ...mapMutations('currentCommunity', [
      'clearData',
      'saveCtoken',
      'saveAllPools',
      'saveFeeRatio',
      'saveOperationCount',
      'saveOperationHistory'])
  },
  beforeDestroy () {
    this.clearData();
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
  border: 1px solid var(--card-broder);
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
      color: rgba(white, .8);
    }
    .active span {
      color: white;
      font-weight: bold;
    }
    .active i {
      opacity: 1;
    }
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
  }
  .sub-page-container {
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
</style>
