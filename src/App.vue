<template>
  <div id="app">
    <div class="page-layout">
      <div class="page-side">
        <div class="text-center">
          <div @click="goHome()" class="hover">
              <empty-img width="2.8rem" height="2.8rem" @click="goHome()"></empty-img>
          </div>
          <router-link to="/community">
            <i class="app-icon mt-4" style="opacity: .7"></i>
          </router-link>
          <div class="divider-line mx-auto my-4"></div>
          <!-- joined community -->
          <div class="pt-3 communities-bar">
            <!-- <router-link to="/sub-community/home">
              <div class="community-logo-box">
                <img class="rounded-circle"
                     src="~@/static/images/tokens/dot.png" alt="">
              </div>
            </router-link> -->
            <img class="rounded-circle w-100 mb-3 hover" @click="gotoCommunity(community.id)" v-show="getCommunityInfoById(community.id)" :src="getCommunityInfoById(community.id) && getCommunityInfoById(community.id).icon"
                 v-for="community of userGraphInfo.inCommunities" :key="community.id" alt="">
          </div>
        </div>
        <!-- bottom -->
        <div class="text-center">
          <div class="divider-line mx-auto my-2"></div>
          <router-link v-show="!loadingMyCommunityInfo && settingStep === 3" to="/manage-community">
            <i class="setting-icon mt-4"></i>
          </router-link>
          <!-- <b-dropdown v-else variant="text" class="setting-dropdown mt-4" toggle-class="p-0">
            <template #button-content>
              <i class="setting-icon"></i>
            </template>
            <template #default>
              <ManageCommunityMenu/>
            </template>
          </b-dropdown> -->
          <div class="hover" @click="gotoCreateCommunity()">
            <i class="add-user-icon mt-4" style="opacity: .7" v-show="!loadingMyCommunityInfo && settingStep !== 3"></i>
          </div>
          <router-link to="/profile">
            <img class="user-avatar hover rounded-circle w-75 my-3"
                 src="~@/static/images/home-s2-icon1.svg" alt="">
          </router-link>
          <div class="hover">
            <i class="menu-icon" style="opacity: .7"></i>
          </div>
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
          <router-view></router-view>
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
import ManageCommunityMenu from '@/components/community/ManageCommunityMenu'

export default {
  components: { ManageCommunityMenu },
  computed: {
    ...mapState(['lang', 'prices']),
    ...mapState('web3', ['allCommunities', 'stakingFactoryId', 'userGraphInfo', 'loadingCommunity', 'account']),
    ...mapState('community', ['loadingMyCommunityInfo', 'communityInfo']),
    ...mapState('currentCommunity', ['communityId']),
    ...mapGetters('community', ['getCommunityInfoById']),
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
    }
  },
  data() {
    return {
      screenWidth: document.body.clientWidth,
    }
  },
  mixins: [showToastMixin],
  methods: {
    ...mapActions('steem', ['setVestsToSteem']),
    ...mapActions('hive', ['setVestsToHive']),
    setLanguage (lang) {
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
      this.$router.replace('/sub-community/home')
    },
    goHome() {
      this.$router.replace('/')
    },
    connect () {
      if (this.address) {
        this.onCopy(this.$t('tip.copyAddress', {
          address: formatUserAddress(this.address)
        }), { title: this.$t('tip.clipboard') })
        return
      }
      setupNetwork()
    }
  },
  mounted () {
    this.setLanguage(localStorage.getItem(LOCALE_KEY) || 'en')
  },
  async created () {
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
  --dividers: #737373;
  --background: #1D1E1F;
  --error: #ff5040;
  --success: #50bf00;
  --link: #408fff;
  --warning: #ff9500;
  --backgroud-state: #b37012;
  --primary: #f8b62a;
  --card-broder: #37383c;
  --card-bg-primary: #161718;
  --nav-tab-bg: #3c3c40;
  --nav-tab-bg-active: #69696f;
  --input-border: #4e5054;
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
@media (min-width: 1200px) {
  .container {
    max-width: 75%;
  }
}
.communities-bar {
  .active .community-logo-box {
    border: 2px solid var(--primary-custom);
    border-radius: 2.8rem;
    width: 2.8rem;
    height: 2.8rem;
    padding: 2px;
    box-sizing: border-box;
  }
  .community-logo-box {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
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
</style>
