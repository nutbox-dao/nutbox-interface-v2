<template>
  <div id="app">
    <div class="page-layout">
      <div class="page-side">
        <div>
          <div @click="goHome()">
              <empty-img width="2.8rem" height="2.8rem" @click="goHome()"></empty-img>
          </div>
          <router-link to="/community">
            <i class="app-icon mt-4" style="opacity: .7"></i>
          </router-link>
          <div class="divider-line mx-auto my-4"></div>
          <div class="pt-3">
            <img class="user-avatar rounded-circle w-100 mb-3" src="~@/static/images/tokens/dot.png" v-for="community of userGraphInfo.inCommunities" :key="community.id" alt="">
          </div>
        </div>
        <div>
          <div class="divider-line mx-auto my-2"></div>
          <i class="add-user-icon mt-4" style="opacity: .7"></i>
          <img class="user-avatar rounded-circle w-75 my-3"
               src="~@/static/images/home-s2-icon1.svg" alt="">
          <i class="menu-icon" style="opacity: .7"></i>
        </div>
      </div>
      <div class="page-container">
        <div class="page-header d-flex justify-content-between align-items-center">
          <div class="page-title font-bold font20">Home</div>
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
import { mapState, mapActions } from 'vuex'
import { setupNetwork, chainChanged } from '@/utils/web3/web3'
import { accountChanged, getAccounts } from '@/utils/web3/account'
import { subBlockNum } from '@/utils/web3/block'
import { getMyStakingFactory } from '@/utils/web3/community'
import { getAllPools, monitorPools, UpdateApysOfPool } from '@/utils/web3/pool'
import { handleApiErrCode, formatUserAddress } from '@/utils/helper'
import { getDelegateFromHive } from '@/utils/hive/hive'
import { getMyJoinedCommunity } from '@/utils/graphql/user'
import showToastMixin from './mixins/copyToast'

export default {
  computed: {
    ...mapState(['lang', 'prices']),
    ...mapState('web3', ['allCommunities', 'stakingFactoryId', 'userGraphInfo']),
    address () {
      if (this.$store.state.web3.account) {
        return formatUserAddress(this.$store.state.web3.account, false)
      }
      return '...'
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
    // BSC data
    async fetchBscData () {
      const stakingId = await getMyStakingFactory();
      console.log(stakingId);
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
      await getAccounts(true)
      getMyJoinedCommunity();
    } catch (e) {
      console.log('Get accounts fail', e)
    }
    try {
      setupNetwork()
      chainChanged()
      accountChanged()
      subBlockNum()
    } catch (e) {
      console.log(533, e)
    }
    // bsc data
    this.fetchBscData();

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
  --background: #24252e;
  --error: #ff5040;
  --success: #50bf00;
  --link: #408fff;
  --warning: #ff9500;
  --backgroud-state: #b37012;
  --primary: #f8b62a;
  --card-broder: #37383c;
  --card-bg-primary: #1b1e23;
  --nav-tab-bg: #3c3c40;
  --nav-tab-bg-active: #69696f;
  --input-border: #4e5054;
  --input-bg: #1b1e23;
}
@import "~bootstrap/scss/bootstrap.scss";
@import "~bootstrap-vue/src/index.scss";
@import "static/css/responsive";
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
  text-align: center;
  color: var(--primary-text);
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: var(--background);
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
      background-image: url("~@/static/images/wallet.png");
    }
  }
}
</style>
