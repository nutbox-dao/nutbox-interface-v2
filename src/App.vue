<template>
  <div id="app">
    <div class="page-layout">
      <div class="page-side">
        <div class="text-center">
          <div @click="goHome()" class="hover">
            <img style="width: 2.8rem;height:2.8rem" src="~@/static/images/logo_small.png" alt="">
          </div>
          <router-link to="/community" class="apps-icon-box">
            <i class="app-icon mt-4"></i>
          </router-link>
          <div class="divider-line mx-auto my-4"></div>
          <!-- joined community -->
          <div class="pt-3 communities-bar">
            <div class="community-logo-box"
                 :class="(inSubCommunityView && (community.id === communityId.toLowerCase())) ? 'active' : ''"
                 v-for="community of userGraphInfo.inCommunities" :key="community.id">
              <img class="rounded-circle w-100 mb-3 hover" @click="gotoCommunity(community.id)"
                  :id="community.id + 'icon'"
                   v-show="getCommunityInfoById(community.id)"
                   :src="getCommunityInfoById(community.id) && getCommunityInfoById(community.id).icon"
                  alt="">
                <b-popover :target="community.id + 'icon'"
                  triggers="hover focus"
                  placement="top">
                  {{ getCommunityInfoById(community.id) && getCommunityInfoById(community.id).name }}
                </b-popover>
            </div>
          </div>
        </div>
        <!-- bottom -->
        <div class="text-center">
          <div class="divider-line mx-auto my-2"></div>
          <router-link v-show="!loadingMyCommunityInfo && settingStep === 3 && metamaskConnected" to="/manage-community">
            <i class="setting-icon mt-4"></i>
          </router-link>
          <div class="hover" @click="gotoCreateCommunity()" v-show="metamaskConnected">
            <i class="add-user-icon mt-4" style="opacity: .7" v-show="!loadingMyCommunityInfo && settingStep !== 3"></i>
          </div>
          <router-link to="/profile" v-show="metamaskConnected">
            <img v-if="!!avatar" :src="avatar" class="user-avatar hover rounded-circle w-75 my-3" alt="">
            <img v-else class="user-avatar hover rounded-circle w-75 my-3"
                 src="~@/static/images/avatar-default.svg" alt="">
          </router-link>
          <b-dropdown variant="text" dropup
                      class="side-menu-dropdown"
                      menu-class="text-white"
                      toggle-class="p-0">
            <template #button-content>
              <i class="menu-icon hover"></i>
            </template>
            <div class="dropdown-menu-card" v-show="!langActive">
              <b-dropdown-item href="https://github.com/nutbox-dao" target="_blank" >
                <i class="dropdown-item-icon github-icon"></i>
                <span>Github</span>
              </b-dropdown-item>
              <b-dropdown-item href="https://nutbox-io.gitbook.io/nutbox/" target="_blank">
                <i class="dropdown-item-icon docs-icon"></i>
                <span>{{ $t("commen.docs") }}</span>
              </b-dropdown-item>
              <b-dropdown-item href="https://discord.com/invite/zPkMuGY" target="_blank">
                <i class="dropdown-item-icon discard-icon"></i>
                <span>Discord</span>
              </b-dropdown-item>
              <b-dropdown-item href="https://t.me/nutbox_defi" target="_blank">
                <i class="dropdown-item-icon telegram-icon"></i>
                <span>Telegram</span>
              </b-dropdown-item>
              <b-dropdown-item href="https://twitter.com/NutboxDao" target="_blank">
                <i class="dropdown-item-icon twitter-icon"></i>
                <span>Twitter</span>
              </b-dropdown-item>
              <!-- <b-dropdown-item href="https://cdn.wherein.mobi/nutbox/v2/docs/REP-Nutbox-Walnut-Network-2021-10-29.pdf" target="_blank">
                <i class="dropdown-item-icon docs-icon"></i>
                <span>{{ $t("commen.auditReport") }}</span>
              </b-dropdown-item> -->
              <!-- <div class="dropdown-item" @click="langActive=true">
                <i class=" language-icon"></i>
                <span>{{$t('commen.language')}}</span>
              </div> -->
            </div>
            <!-- <div class="dropdown-menu-card" v-show="langActive">
              <div class="dropdown-item">
                <i class="back-icon" @click="langActive=false"></i>
              </div>
              <b-dropdown-item @click="setLanguage(lang)"
                               v-for="lang of langOptions" :key="lang">
                <span>{{ $t(`commen.${lang}`) }}</span>
              </b-dropdown-item>
            </div> -->
          </b-dropdown>
        </div>
      </div>
      <!-- right part -->
      <div class="page-container">
        <div class="page-header d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center" v-if="$route.path.indexOf('sub-community')>=0">
            <img class="community-logo rounded-circle mr-2"
                 :src="currentCommunityInfo && currentCommunityInfo.icon" alt="">
            <span>{{ currentCommunityInfo && currentCommunityInfo.name }}</span>
          </div>
          <div v-else class="page-title font-bold font20">{{$route.name}}</div>
          <div class="address-box" @click="connect">
            <i class="wallet-icon"></i>
            <div class="font12">{{ address || $t("commen.connectMetamask") }}</div>
          </div>
        </div>
        <div class="page-content">
          <router-view :key="communityId"></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LOCALE_KEY } from '@/config'
import { mapState, mapActions, mapGetters } from 'vuex'
import { setupNetwork, chainChanged } from '@/utils/web3/web3'
import { accountChanged, getAccounts, updateAllUsersByPolling } from '@/utils/web3/account'
import { subBlockNum } from '@/utils/web3/block'
import { getMyCommunityInfo, updateAllCommunitiesFromBackend } from '@/utils/web3/community'
import { updateAllTokensFromBackend } from '@/utils/web3/asset'
import { handleApiErrCode, formatUserAddress } from '@/utils/helper'
import { getMyJoinedCommunity } from '@/utils/graphql/user'
import showToastMixin from './mixins/copyToast'
import {ethers} from 'ethers'

export default {
  computed: {
    ...mapState(['lang', 'prices', 'metamaskConnected']),
    ...mapState('web3', ['allCommunities', 'stakingFactoryId', 'userGraphInfo', 'loadingCommunity', 'account']),
    ...mapState('community', ['loadingMyCommunityInfo', 'communityInfo']),
    ...mapState('currentCommunity', ['communityId']),
    ...mapGetters('community', ['getCommunityInfoById']),
    ...mapGetters('user', ['getUserByAddress']),
    address () {
      if (this.account) {
        return formatUserAddress(this.account, false)
      }
    },
    currentCommunityInfo() {
      if (this.communityId){
        return this.getCommunityInfoById(this.communityId)
      }
      return null
    },
    avatar() {
      const user = this.getUserByAddress(this.account)
      if (user) {
        return user.avatar
      }
    },
    settingStep () {
      const c = this.communityInfo
      if (!this.stakingFactoryId){
        return 1;
      }
      if (c && c.name && c.name.length > 0) {
        return 3;
      }else {
        return 2;
      }
    },
    inSubCommunityView() {
      if (this.$route.path.indexOf('sub-community') !== -1){
        return true;
      }
      return false
    }
  },
  data() {
    return {
      screenWidth: document.body.clientWidth,
      langActive: false,
      langOptions: ['en', 'kr', 'es', 'my']
    }
  },
  mixins: [showToastMixin],
  methods: {
    ...mapActions('steem', ['setVestsToSteem']),
    ...mapActions('hive', ['setVestsToHive']),
    setLanguage (lang) {
      this.langActive = false
      localStorage.setItem(LOCALE_KEY, lang)
      this.$store.commit('saveLang', lang)
      this.$i18n.locale = lang
    },
    gotoCreateCommunity()  {
      if (this.settingStep === 1) {
        this.$router.push('/community/deploy-token')
      }else if (this.settingStep === 2) {
        this.$router.push('/community/set-profile')
      }
    },
    gotoCommunity(communityId) {
      this.$store.commit('currentCommunity/saveCommunityId', communityId);
      this.$router.push('/sub-community/home/' + communityId.substring(0, 10))
    },
    goHome() {
      this.$router.push('/')
    },
    connect () {
      if (this.metamaskConnected) {
        this.onCopy(this.$t('tip.copyAddress', {
          address: formatUserAddress(this.address)
        }), { title: this.$t('tip.clipboard') })
        return
      }
      setupNetwork()
    },
  },
  mounted () {
    this.setLanguage(localStorage.getItem(LOCALE_KEY) || 'en')
  },
  async created () {
    try {
      setupNetwork()
      chainChanged(() => {
        this.$router.go(0);
      })
      accountChanged(() => {
        this.$router.go(0);
      })
      subBlockNum()
    } catch (e) {
      console.log(533, e)
    }
        // bsc related
    try {
      updateAllCommunitiesFromBackend();
      updateAllTokensFromBackend();
      updateAllUsersByPolling();
      await getAccounts(true)
      getMyJoinedCommunity();
      getMyCommunityInfo().catch(e => {
        console.log('No created token by current user');
      });
    } catch (e) {
      console.log('Get accounts fail', e)
    }

    // get steem vests ratio
    this.setVestsToSteem()
    this.setVestsToHive()
  }
}
</script>

<style lang="scss">
:root {
  --yellow-background: #f5ecd8;
  --primary-custom: #f8b62a;
  --primary-custom-rgb: 255, 219, 27;
  --primary-hover: #ffeb75;
  --primary-text: white;
  --primary-btn-text-color: #242629;
  --secondary-text: #717376;
  --disable: #bdbfc2;
  --dividers: #242526;
  --background: #1D1E1F;
  --error: #ff5040;
  --success: #50bf00;
  --link: #408fff;
  --warning: #ff9500;
  --backgroud-state: #b37012;
  --primary: #f8b62a;
  --card-broder: #37383c;
  --card-bg-primary: #141414;
  --nav-tab-bg: #2C2D2E;
  --nav-tab-bg-active: #141414;
  --input-border: #2C2D2E;
  --input-bg: #1b1e23;
  --block-bg: #1C1D1E;
  --text-grey-7: #747576;
}
@import "~bootstrap/scss/bootstrap.scss";
@import "~bootstrap-vue/src/index.scss";
@import "static/css/responsive";
@import "static/css/font";
@import "static/css/common.scss";
@import "static/css/layout";
@import "static/css/modal";
@import "static/css/dropdown";
html,
body {
  height: 100%;
  margin: 0;
  background-color: var(--background);
}
::-webkit-scrollbar{display:none;}
#app {
  font-family: PingFang SC, -apple-system, BlinkMacSystemFont,
    "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans",
    "Droid Sans", "Helvetica Neue";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--primary-text);
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: var(--background);
}
@media (min-width: 1600px) {
  .container {
    max-width: 75%;
  }
}
.communities-bar {
  .community-logo-box {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
    padding: 1px;
  }
  .active {
    border: 1px solid var(--primary-custom);
    border-radius: 2.8rem;
    width: 2.6rem;
    height: 2.6rem;
    padding: 1px;
    box-sizing: border-box;
  }
  .community-logo-box img {
    max-width: 2.4rem;
    max-height: 2.4rem;
    width: 100%;
    height: 100%;
  }
}
.address-box {
  height: 2rem;
  border: 1px solid var(--card-broder);
  border-radius: 2rem;
  background-color: rgba(255, 219, 38, 0.05);
  display: flex;
  align-items: center;
  padding: .2rem .5rem .2rem .2rem;
  cursor: pointer;
  .wallet-icon {
    border: 1px solid var(--card-broder);
    border-radius: 50%;
    height: 1.6rem;
    width: 1.6rem;
    padding: .2rem;
    margin-right: .3rem;
    &::after {
      content: '';
      @include icon;
      background-image: url("~@/static/images/wallet.svg");
    }
  }
}
.community-logo {
  width: 2rem;
  height: 2rem;
}
.dropdown-menu-card {
  @include card(1.2rem 0, #2C2D2E);
  border: 1px solid #747576;
  i {
    @include icon(1.6rem, 1.6rem);
    margin-right: .4rem;
  }
  span {
    color: white;
    font-size: .8rem;
    font-weight: bold;
    //user-select: none;
  }
}
.github-icon {
  background-image: url("~@/static/images/h-github.svg");
}
.docs-icon {
  background-image: url("~@/static/images/h-docs.svg");
}
.discard-icon {
  background-image: url("~@/static/images/h-discord.svg");
}
.twitter-icon {
  background-image: url("~@/static/images/h-twitter.svg");
}
.telegram-icon {
  background-image: url("~@/static/images/h-telegram.svg");
}
.medium-icon {
  background-image: url("~@/static/images/h-mdeium.svg");
}
.back-icon {
  background-image: url("~@/static/images/back.svg");
}
</style>
