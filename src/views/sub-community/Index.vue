<template>
  <div class="container h-100">
    <div class="sub-community-page">
      <div class="sub-page-side">
        <div class="slider-content">
          <div class="menu-items">
            <b-nav vertical align="center" class="top">
              <b-nav-item to="/sub-community/home/">
                <i class="menu-icon home-icon" />
                <span>Home</span>
              </b-nav-item>
              <b-nav-item to="/sub-community/iso">
                <i class="menu-icon iso-icon" />
                <span>ISO</span>
              </b-nav-item>
              <b-nav-item to="/sub-community/staking">
                <i class="menu-icon farming-icon" />
                <span>Farming</span>
              </b-nav-item>
              <b-nav-item to="/sub-community/nut-power">
                <i class="menu-icon nut-power-icon" />
                <span>NUT Power</span>
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
            <img class="hover" v-b-popover.hover.top="'Github'"
                 v-if="communityInfo && communityInfo.github && communityInfo.github != 'undefined' && communityInfo.github != 'null'"
                 src="~@/static/images/h-github.svg" @click="openTab(communityInfo.github)" alt="">
            <img class="hover" v-b-popover.hover.top="'Document'"
                 v-if="communityInfo && communityInfo.document && communityInfo.document != 'undefined' && communityInfo.document != 'null'"
                 src="~@/static/images/h-docs.svg" @click="openTab(communityInfo.document)" alt="">
            <img class="hover" v-b-popover.hover.top="'Facebook'"
                 v-if="communityInfo && communityInfo.facebook && communityInfo.facebook != 'undefined' && communityInfo.facebook != 'null'"
                 src="~@/static/images/h-facebook.svg" @click="openTab(communityInfo.facebook)" alt="">
            <img class="hover" v-b-popover.hover.top="'Discord'"
                 v-if="communityInfo && communityInfo.discord && communityInfo.discord != 'undefined' && communityInfo.discord != 'null'"
                 src="~@/static/images/h-discord.svg" @click="openTab(communityInfo.discord)" alt="">
            <img class="hover" v-b-popover.hover.top="'Telegram'"
                 v-if="communityInfo && communityInfo.telegram && communityInfo.telegram != 'undefined' && communityInfo.telegram != 'null'"
                 src="~@/static/images/h-telegram.svg" @click="openTab(communityInfo.telegram)" alt="">
            <img class="hover" v-b-popover.hover.top="'Twitter'"
                 v-if="communityInfo && communityInfo.twitter && communityInfo.twitter != 'undefined' && communityInfo.twitter != 'null'"
                 src="~@/static/images/h-twitter.svg" @click="openTab(communityInfo.twitter)" alt="">
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
                  <b-dropdown-item :to="'/sub-community/home'">
                    <i class="menu-icon home-icon" />
                    <span>Home</span>
                  </b-dropdown-item>
                  <b-dropdown-item to="/sub-community/iso">
                    <i class="menu-icon iso-icon" />
                    <span>ISO</span>
                  </b-dropdown-item>
                  <b-dropdown-item to="/sub-community/staking">
                    <i class="menu-icon farming-icon" />
                    <span>Farming</span>
                  </b-dropdown-item>
                  <b-dropdown-item to="/sub-community/nut-power">
                    <i class="menu-icon nut-power-icon" />
                    <span>NUT Power</span>
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
                    <img id="com-github" v-show="communityInfo && communityInfo.github && communityInfo.github != 'undefined' && communityInfo.github != 'null'" src="~@/static/images/h-github.svg" @click="openTab(communityInfo.github)" alt="">
                    <img id="c-document" v-show="communityInfo && communityInfo.document && communityInfo.document != 'undefined' && communityInfo.document != 'null'" src="~@/static/images/h-docs.svg" @click="openTab(communityInfo.document)" alt="">
                    <img id="c-facebook" v-show="communityInfo && communityInfo.facebook && communityInfo.facebook != 'undefined' && communityInfo.facebook != 'null'" src="~@/static/images/h-facebook.svg" @click="openTab(communityInfo.facebook)" alt="">
                    <img id="c-discord" v-show="communityInfo && communityInfo.discord && communityInfo.discord != 'undefined' && communityInfo.discord != 'null'" src="~@/static/images/h-discord.svg" @click="openTab(communityInfo.discord)" alt="">
                    <img id="c-telegram" v-show="communityInfo && communityInfo.telegram && communityInfo.telegram != 'undefined' && communityInfo.telegram != 'null'" src="~@/static/images/h-telegram.svg" @click="openTab(communityInfo.telegram)" alt="">
                    <img id="c-twitter" v-show="communityInfo && communityInfo.twitter && communityInfo.twitter != 'undefined' && communityInfo.twitters != 'null'" src="~@/static/images/h-twitter.svg" @click="openTab(communityInfo.twitter)" alt="">
                  </div>
                    <b-popover target="com-github" triggers="hover focus" placement="top">
                      Github
                    </b-popover>
                    <b-popover target="c-document" triggers="hover" placement="top">
                      Document
                    </b-popover>
                    <b-popover target="c-facebook" triggers="hover" placement="top">
                      Facebook
                    </b-popover>
                    <b-popover target="c-discord" triggers="hover" placement="top">
                      Discord
                    </b-popover>
                    <b-popover target="c-telegram" triggers="hover" placement="top">
                      Telegram
                    </b-popover>
                    <b-popover target="c-twitter" triggers="hover" placement="top">
                      Twitter
                    </b-popover>
                </div>
              </div>
            </template>
          </b-dropdown>
        </div>
        <router-view :key="communityId"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import { getSpecifyCommunityInfo } from '@/utils/graphql/community'
import { getApprovement, getCommunityBalance } from '@/utils/web3/community'
import { handleApiErrCode, rollingFunction } from '@/utils/helper';
import { getCToken } from '@/utils/web3/asset';
import { NutAddress } from '@/config'
import { getCommunityRewardPerBlock } from '@/utils/web3/community'
import { getPools as getPoolsFromGraph} from '@/utils/graphql/pool'

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
    if (!this.$route.query.id) {
      this.$router.replace('/');
      return;
    }
    this.$store.commit('currentCommunity/saveCommunityId', this.$route.query.id);
    try {
      this.loading = true;
      this.clearData();
      this.$store.commit('community/saveLoadingApproveCommunity', true)
      this.$store.commit('community/saveApprovedCommunity', false)
      getCommunityRewardPerBlock(this.communityId)
      getApprovement(NutAddress, this.communityId).then(res => {
        this.$store.commit('community/saveApprovedCommunity', res)
      }).finally(() => {
        this.$store.commit('community/saveLoadingApproveCommunity', false)
      })
      getSpecifyCommunityInfo(this.communityId).then(community => {
        getCToken(community.id).then(ctoken => {
          this.saveCtoken(ctoken)
          if (!ctoken.isMintable) {
            const interval = rollingFunction(getCommunityBalance, { communityId: this.communityId, ctokenAddress: ctoken.address }, 10, (balance) => {
              this.saveCommunityBalance(balance);
            })
            interval.start();
            this.$once('hook:beforeDestroy', () => {
              interval.stop();
            })
          }
        }).catch(e => {
          console.log('get ctoken fail:', e);
        })


        this.saveFeeRatio(community.feeRatio)
        this.saveOperationCount(community.operationCount)
        this.saveAllPools(community.pools)
        this.saveOperationHistory(community.operationHistory)
        this.saveAllUsers(community.users)
        const updatePoolsFromGraph = rollingFunction(
          getPoolsFromGraph,
          community.pools.map((p) => p.id),
          10, (pools) => {
            if (pools && pools.length > 0){
              this.$store.commit('currentCommunity/saveAllPools', pools)
            }
          }
        );
        updatePoolsFromGraph.start();
        this.$once('hook:beforeDestroy', () => {
          updatePoolsFromGraph.stop();
        })
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
      'saveAllUsers',
      'saveCommunityBalance']),
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
  width: 170px;
  height: 100%;
  margin-right: 16px;
}
.slider-content {
  height: calc(100% - 16px);
  width: 100%;
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
      padding: 12px 20px;
      &:hover {
        background: var(--block-bg);
      }
    }
    i {
      margin-right: .5rem;
      opacity: .8;
    }
    span {
      font-size: 16px;
      line-height: 16px;
      color: var(--text-74);
      white-space: nowrap;
    }
    .active span {
      color: var(--sub-primary);
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
    width: 170px;
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
  @include icon(24px, 24px);
}
.home-icon {
  background-image: url("~@/static/images/menu-home.svg");
}
.blog-icon {
  background-image: url("~@/static/images/menu-social.svg");
}
.farming-icon {
  background-image: url("~@/static/images/menu-farming.svg");
}
.iso-icon {
  background-image: url("~@/static/images/menu-stake.svg");
}
.nut-power-icon {
  background-image: url("~@/static/images/menu-nut-power.svg");
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
.dashboard-icon {
  background-image: url("~@/static/images/menu-dashboard.svg");
}
.active {
  .home-icon {
    background-image: url("~@/static/images/menu-home-active.svg");
  }
  .blog-icon {
    background-image: url("~@/static/images/menu-social-active.svg");
  }
  .farming-icon {
    background-image: url("~@/static/images/menu-farming-active.svg");
  }
  .iso-icon {
    background-image: url("~@/static/images/menu-stake-active.svg");
  }
  .nut-power-icon {
    background-image: url("~@/static/images/menu-nut-power-active.svg");
  }
  .dapp-icon {
    background-image: url("~@/static/images/menu-dapp-active.svg");
  }
  .governance-icon {
    background-image: url("~@/static/images/menu-governance-active.svg");
  }
  .member-icon {
    background-image: url("~@/static/images/menu-member-active.svg");
  }
  .dashboard-icon {
    background-image: url("~@/static/images/menu-dashboard-active.svg");
  }
}
</style>
