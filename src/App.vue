<template>
  <div id="app">
    <div class="page-layout">
      <div class="page-side">
        <div>
          <empty-img width="2.8rem" height="2.8rem"></empty-img>
          <i class="app-icon mt-4" style="opacity: .7"></i>
          <div class="divider-line mx-auto my-4"></div>
          <div class="pt-3">
            <empty-img width="2.8rem" height="2.8rem" border-radius="50%" class="mb-3"></empty-img>
            <empty-img width="2.8rem" height="2.8rem" border-radius="50%"></empty-img>
          </div>
        </div>
        <div>
          <div class="divider-line mx-auto my-2"></div>
          <i class="add-user-icon mt-4" style="opacity: .7"></i>
          <empty-img width="2.2rem" height="2.2rem" border-radius="50%" class="my-3"></empty-img>
          <i class="menu-icon" style="opacity: .7"></i>
        </div>
      </div>
      <div class="page-container">
        <div class="page-header d-flex justify-content-between align-items-center">
          <div class="page-title font-bold font20">Home</div>
          <div class="account">0x....</div>
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
import { getAllCommunities } from '@/utils/web3/community'
import { getAllPools, monitorPools, UpdateApysOfPool } from '@/utils/web3/pool'
import { handleApiErrCode } from '@/utils/helper'
import { getDelegateFromHive } from '@/utils/hive/hive'

export default {
  computed: {
    ...mapState(['lang', 'prices']),
    ...mapState('web3', ['allCommunities', 'stakingFactoryId']),
  },
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
    }
  },
  mounted () {
    this.setLanguage(localStorage.getItem(LOCALE_KEY) || 'en')
  },
  async created () {
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
  }
}
</script>

<style lang="scss">
:root {
  --yellow-background: #f5ecd8;
  --primary-custom: #ffdb1b;
  --primary-custom-rgb: 255, 219, 27;
  --primary-hover: #ffeb75;
  --primary-text: white;
  --primary-btn-text-color: #242629;
  --secondary-text: #717376;
  --disable: #bdbfc2;
  --dividers: #737373;
  --background: #24242d;
  --error: #ff5040;
  --success: #50bf00;
  --link: #408fff;
  --warning: #ff9500;
  --backgroud-state: #b37012;
  --primary: #ffdb1b;
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
#home-icon {
  background-image: url("./static/images/home.svg");
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
  #home-icon {
    background-image: url("./static/images/home-hover.svg");
  }
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
