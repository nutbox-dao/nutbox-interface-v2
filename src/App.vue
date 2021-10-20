<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { LOCALE_KEY } from '@/config'
import { mapState, mapMutations, mapActions } from 'vuex'
import { initApis } from '@/utils/commen/api'
import { isMobile } from '@/utils/commen/util'
import { setupNetwork, chainChanged } from '@/utils/web3/web3'
import { accountChanged, getAccounts } from '@/utils/web3/account'
import { subBlockNum } from '@/utils/web3/block'
import { getAllCommunities } from '@/utils/web3/community'
import { getAllPools, monitorPools, UpdateApysOfPool } from '@/utils/web3/pool'
import { handleApiErrCode } from '@/utils/helper'
import {
  loadAccounts as loadPolkadotAccounts
} from '@/utils/polkadot/account'

export default {
  computed: {
    ...mapState('polkadot', [
      'isConnected',
      'allAccounts',
      'account',
      'crowdstakings',
      'communitys',
      'projects',
      'clCommunitys'
    ]),
    ...mapState(['lang', 'prices']),
    ...mapState('web3', ['allCommunities', 'stakingFactoryId']),
  },
  methods: {
    ...mapMutations('polkadot', [
      'saveCrowdstakings',
      'saveCommunitys',
      'saveProjects',
      'saveAccount'
    ]),
    ...mapMutations('polkadot', ['saveClCommunitys']),
    ...mapActions('steem', ['setVestsToSteem']),
    ...mapActions('hive', ['setVestsToHive']),
    setLanguage (lang) {
      localStorage.setItem(LOCALE_KEY, lang)
      this.$store.commit('saveLang', lang)
      this.$i18n.locale = lang
    },
        // BSC data
    async fetchBscData () {
      try {
        this.loading = true
        getAllCommunities()
        getAllPools().then(res => {
          monitorPools()
        }).catch(console.error)
      } catch (e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      } finally {
        this.loading = false
      }
    }
  },
  mounted () {
    this.setLanguage(localStorage.getItem(LOCALE_KEY) || 'en')
  },
  async created () {
    const id = this.$route.query.id
    if (id) {
      this.$store.commit('saveCurrentCommunityId', id)
    }
    // BSC data
    this.fetchBscData()
    // bsc related
    try {
      await getAccounts(true)
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
    // get steem vests ratio
    this.setVestsToSteem()
    this.setVestsToHive()
    UpdateApysOfPool()

    // 如果是手机端，直接清空账号缓存，用插件中的第一个地址
    if (isMobile()) {
      console.log('Is mobile device')
      this.$store.commit('polkadot/saveAccount', null)
    }

    // init polkadot apis
    initApis().then(api => {
      loadPolkadotAccounts()
    })
  }
}
</script>

<style lang="scss">
$blue: #ffdb1b;
:root {
  --yellow-background: #f5ecd8;
  --primary-custom: #ffdb1b;
  --primary-custom-rgb: 255, 219, 27;
  --primary-hover: #ffeb75;
  --primary-text: #242629;
  --primary-btn-text-color: #242629;
  --secondary-text: #717376;
  --disable: #bdbfc2;
  --dividers: #e3e5e8;
  --background: #F5F6F8;
  --error: #ff5040;
  --success: #50bf00;
  --link: #408fff;
  --warning: #ff9500;
  --backgroud-state: #b37012;
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
}
#app {
  font-family: PingFangSC-Medium, PingFang SC, -apple-system, BlinkMacSystemFont,
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
  overflow-x: hidden;
  overflow-y: auto;
  font-size: 14px;
  background-color: var(--background);
}
::-webkit-scrollbar{display:none;}
.spinner-grow {
  margin-bottom: 2px;
  margin-right: 8px;
}
input {
  border: none;
  outline: none;
}
input::-webkit-input-placeholder {
  color: var(--disable);
}
.mask {
  z-index: 2000;
  overflow: hidden;
  display: flex;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
}
.loading-bg {
  display: flex;
  align-content: center;
  align-items: center;
  width: 100%;
  justify-content: center;
  flex-direction: column;
  img {
    margin-top: 12rem;
  }
  p {
    margin-top: 1rem;
    font-weight: 400;
    color: #bdbfc2;
    line-height: 22px;
  }
}
.c-tooltip {
  @include c-flex-between-center;
  span:first-child {
    font-weight: bold;
    min-width: 5rem;
  }
}
.cropper-modal .modal-content {
  background-color: transparent;
  border: transparent;
}
.cropper-modal .modal-body{
  padding: 0;
}
#wallet-icon {
  background-image: url("./static/images/wallet.svg");
}
#stake-icon {
  background-image: url("./static/images/stake.svg");
}
#farming-icon {
  background-image: url("./static/images/farming.svg");
}
#liquid-staking-icon {
  background-image: url("./static/images/swap.svg");
}
#upvote-icon {
  background-image: url("./static/images/upvote.svg");
}
#blog-icon {
  background-image: url("./static/images/blog.svg");
}
#nps-icon {
  background-image: url("./static/images/nps.svg");
}
#admin-icon {
  background-image: url("./static/images/admin.svg");
}
#community-icon {
  background-image: url("./static/images/menu-icon-community.svg");
}
#game-icon {
  background-image: url("./static/images/game.png")
}
#setting-icon {
  @include icon(1.2rem, 1.2rem);
  background-image: url("~@/static/images/setting-icon.svg");
}

.active {
  #wallet-icon {
    background-image: url("./static/images/wallet-hover.svg");
  }
  #stake-icon {
    background-image: url("./static/images/stake-hover.svg");
  }
  #farming-icon {
    background-image: url("./static/images/farming-hover.svg");
  }
  #liquid-staking-icon {
    background-image: url("./static/images/swap-hover.svg");
  }
  #upvote-icon {
    background-image: url("./static/images/upvote-hover.svg");
  }
  #blog-icon {
    background-image: url("./static/images/blog-hover.svg");
  }
  #nps-icon {
    background-image: url("./static/images/nps-hover.svg");
  }
  #admin-icon {
    background-image: url("./static/images/admin-hover.svg");
  }
  #community-icon {
    background-image: url("./static/images/menu-icon-community-hover.svg");
  }
  #game-icon {
  background-image: url("./static/images/game-hover.png")
}
}
</style>
