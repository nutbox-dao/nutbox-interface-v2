<template>
  <div id="app">
    <div class="page-layout">
      <div class="page-header flex-between-center">
        <div class="logo">
          <img v-if="screenWidth < 960" src="./static/images/logo_small.png"
               alt="nutbox" v-b-toggle.sidebar-menu/>
        </div>
<!--        <div class="account-header">-->
<!--          <div class="p-2">-->
<!--            <b-dropdown-->
<!--              class="account-dropdown"-->
<!--              toggle-class="accounts-toggle"-->
<!--              variant="text"-->
<!--              right-->
<!--              no-caret-->
<!--            >-->
<!--              <template #button-content>-->
<!--                <div-->
<!--                  class="flex-between-center font18"-->
<!--                  @click="accountsPop = !accountsPop"-->
<!--                >-->
<!--                  <Identicon-->
<!--                    :size="30"-->
<!--                    theme="polkadot"-->
<!--                    v-if="account"-->
<!--                    :value="account.address"-->
<!--                  />-->
<!--                  <b-avatar v-else class="mr-2" size="sm" text=""></b-avatar>-->
<!--                  <span style="margin-left: 8px">{{-->
<!--                      formatUserAddress(-->
<!--                        account && account.meta && account.meta.name-->
<!--                      )-->
<!--                    }}</span>-->
<!--                </div>-->
<!--              </template>-->
<!--              <b-dropdown-item-->
<!--                v-for="(item, index) of allAccounts ? allAccounts : []"-->
<!--                :key="index"-->
<!--                @click="changeAccount(item)"-->
<!--              >-->
<!--                <template>-->
<!--                  <div class="flex-between-center">-->
<!--                    <Identicon-->
<!--                      class="ident-icon"-->
<!--                      :size="30"-->
<!--                      theme="polkadot"-->
<!--                      :value="item.address"-->
<!--                    />-->
<!--                    <div class="account-info">-->
<!--                      <div class="font-bold">-->
<!--                        {{ item.meta ? item.meta.name : "" }}-->
<!--                      </div>-->
<!--                      <div class="address">-->
<!--                        {{ formatUserAddress(item.address) }}-->
<!--                      </div>-->
<!--                    </div>-->
<!--                    <img-->
<!--                      class="ml-3"-->
<!--                      v-if="item.address === (account && account.address)"-->
<!--                      src="~@/static/images/selected.png"-->
<!--                      alt=""-->
<!--                    />-->
<!--                  </div>-->
<!--                </template>-->
<!--              </b-dropdown-item>-->
<!--            </b-dropdown>-->
<!--          </div>-->
<!--        </div>-->
      </div>
      <b-sidebar id="sidebar-menu" no-header :backdrop="screenWidth<960">
        <div class="menu-box">
          <img class="menu-logo" src="./static/images/logo.png" alt="nutbox"/>
          <div class="menu-items">
            <b-nav vertical align="center" class="top">
              <b-nav-item to="/wallet" router-tag="div">
                <i id="wallet-icon" class="menu-icon" />
                <span>{{ $t("wallet.wallet") }}</span>
              </b-nav-item>
              <b-nav-item to="/crowdloan">
                <i id="farming-icon" class="menu-icon" />
                <span>{{ $t("cl.crowdloan") }}</span>
              </b-nav-item>
              <b-nav-item to="/crowdstaking" router-tag="div">
                <i id="stake-icon" class="menu-icon" />
                <span>{{ $t("cs.crowdstaking") }}</span>
              </b-nav-item>
              <b-nav-item to="/blog">
                <i id="blog-icon" class="menu-icon" />
                <span>{{ $t("message.blog") }}</span>
              </b-nav-item>
              <b-nav-item to="/admin" v-if="isAdmin">
                <i id="admin-icon" class="menu-icon" />
                <span>{{ $t("message.admin") }}</span>
              </b-nav-item>
              <b-nav-item to="/community" v-if="isAdmin">
                <i id="community-icon" class="menu-icon" />
                <span>{{ $t("cs.community") }}</span>
              </b-nav-item>
            </b-nav>
            <div class="bottom">
              <div class="links">
<!--                <a id="justswap-icon" href="https://github.com/nutbox-dao" target="_blank">-->
<!--                  <b-popover target="github-icon" triggers="hover focus" placement="top">-->
<!--                    Github-->
<!--                  </b-popover>-->
<!--                </a>-->
                <a id="github-icon" href="https://github.com/nutbox-dao" target="_blank">
                  <b-popover target="github-icon" triggers="hover focus" placement="top">
                    Github
                  </b-popover>
                </a>
                <a id="docs-icon" href="https://docs.nutbox.io/lite_paper_v1/" target="_blank">
                  <b-popover target="docs-icon" triggers="hover focus" placement="top">
                    {{ $t("message.docs") }}
                  </b-popover>
                </a>
                <a id="discord-icon" href="https://discord.com/invite/zPkMuGY" target="_blank">
                  <b-popover target="discord-icon" triggers="hover focus" placement="top">
                    Discord
                  </b-popover>
                </a>
                <a id="telegram-icon" href="https://t.me/nutbox_defi" target="_blank">
                  <b-popover target="telegram-icon" triggers="hover focus" placement="top">
                    Telegram
                  </b-popover>
                </a>
              </div>
              <div class="h-line"></div>
              <div class="settings">
                <b-dropdown :no-flip="true" offset="50"
                  id="language"
                  :text="lang.toUpperCase()"
                  size="sm"
                  block
                  dropup
                  no-caret
                >
                  <b-dropdown-item @click="setLanguage('en')">
                    <b-icon
                      style="font-size: 20px"
                      :icon="lang == 'en' ? 'check' : 'blank'"
                      aria-hidden="true"
                    ></b-icon>
                    <span style="font-size: 14px">{{ $t("message.en") }}</span>
                  </b-dropdown-item>
                  <b-dropdown-item @click="setLanguage('zh')">
                    <b-icon
                      style="font-size: 20px"
                      :icon="lang == 'zh' ? 'check' : 'blank'"
                      aria-hidden="true"
                    ></b-icon>
                    <span style="font-size: 14px">{{ $t("message.zh") }}</span>
                  </b-dropdown-item>
                  <b-dropdown-item @click="setLanguage('kr')">
                    <b-icon
                      style="font-size: 20px"
                      :icon="lang == 'kr' ? 'check' : 'blank'"
                      aria-hidden="true"
                    ></b-icon>
                    <span style="font-size: 14px">{{ $t("message.kr") }}</span>
                  </b-dropdown-item>
                  <b-dropdown-item @click="setLanguage('es')">
                    <b-icon
                      style="font-size: 20px"
                      :icon="lang == 'es' ? 'check' : 'blank'"
                      aria-hidden="true"
                    ></b-icon>
                    <span style="font-size: 14px">{{ $t("message.es") }}</span>
                  </b-dropdown-item>
                  <b-dropdown-item @click="setLanguage('my')">
                    <b-icon
                      style="font-size: 20px"
                      :icon="lang == 'my' ? 'check' : 'blank'"
                      aria-hidden="true"
                    ></b-icon>
                    <span style="font-size: 14px">{{ $t("message.my") }}</span>
                  </b-dropdown-item>
                  <b-dropdown-item @click="setLanguage('jp')">
                    <b-icon
                      style="font-size: 20px"
                      :icon="lang == 'jp' ? 'check' : 'blank'"
                      aria-hidden="true"
                    ></b-icon>
                    <span style="font-size: 14px">{{ $t("message.jp") }}</span>
                  </b-dropdown-item>
                </b-dropdown>
              </div>
            </div>
          </div>
        </div>
      </b-sidebar>
      <TipMessage
        :showMessage="tipMessage"
        :title="tipTitle"
        v-if="showMessage"
        @hideMask="showMessage = false"
      />
      <div class="page-container">
        <div class="container">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LOCALE_KEY } from './config'
import TipMessage from './components/ToolsComponents/TipMessage'
import { mapState, mapMutations } from 'vuex'
import Identicon from '@polkadot/vue-identicon'
import { getCommnunitys, getCrowdstacking } from '@/apis/api'
import {
  getBalance as getPolkadotBalance,
  loadAccounts as loadPolkadotAccounts
} from './utils/polkadot/account'
import { getBalance as getKusamaBalance } from './utils/kusama/account'
import { subBlock as subPolkadotBlock } from './utils/polkadot/block'
import { subBlock as subKusamaBlock } from './utils/kusama/block'
import {
  subBonded,
  subNominators,
  getValidatorsInfo
} from './utils/polkadot/staking'
import { subBonded as subKusamaBonded } from './utils/kusama/staking'
import { stanfiAddress } from './utils/polkadot/polkadot'

export default {
  data () {
    return {
      tipMessage: '',
      tipTitle: '',
      showMessage: false,
      accountsPop: false,
      screenWidth: document.body.clientWidth
    }
  },
  computed: {
    ...mapState('polkadot', [
      'isConnected',
      'allAccounts',
      'account',
      'crowdstakings',
      'communitys',
      'projects'
    ]),
    ...mapState('kusama', ['clCommunitys']),
    ...mapState(['lang']),
    contributionsIcon () {
      return this.activeNav === 'contributions'
        ? require('./static/images/contributions_selected.png')
        : require('./static/images/contributions.png')
    },
    dashboardIcon () {
      return this.activeNav === 'dashboard'
        ? require('./static/images/dashboard_selected.png')
        : require('./static/images/dashboard.png')
    },
    isAdmin () {
      if (!this.clCommunitys || !this.projects) return false
      const isCrowdloanAdmin = this.clCommunitys?.indexOf(this.account?.address) !== -1
      const isCrowdstakingAdmin = this.projects?.indexOf(this.account?.address) !== -1
      const res = isCrowdloanAdmin || isCrowdstakingAdmin
      return res
    }
  },
  components: {
    TipMessage,
    Identicon
  },
  methods: {
    ...mapMutations('polkadot', [
      'saveCrowdstakings',
      'saveCommunitys',
      'saveProjects',
      'saveAccount'
    ]),
    ...mapMutations('kusama', ['saveClCommunitys']),
    setLanguage (lang) {
      localStorage.setItem(LOCALE_KEY, lang)
      this.$store.commit('saveLang', lang)
      this.$i18n.locale = lang
    },
    formatUserAddress (address, long = true) {
      if (!address) return 'Loading Account'
      if (long) {
        if (address.length < 16) return address
        const start = address.slice(0, 28)
        const end = address.slice(-5)
        return `${start}...`
      } else {
        const start = address.slice(0, 6)
        const end = address.slice(-6)
        return `${start}...${end}`
      }
    },
    changeAccount (acc) {
      if (!this.isConnected) return
      if (this.$route.path === '/admin') {
        // 调到主页去
        this.$router.push('/crowdloan')
      }
      this.saveAccount(acc)
      getPolkadotBalance(acc)
      getKusamaBalance(acc)
      subKusamaBonded()
      subBonded()
      subNominators()
      this.getCommnunitys()
      this.getCrowdstacking()
    },
    showError (err) {
      this.$bvToast.toast(err, {
        title: 'MFund',
        autoHideDelay: 5000,
        variant: 'danger'
      })
    },
    getCommnunitys () {
      // 获取支持平行链项目的社区信息  -   kusama
      getCommnunitys().then((res) => {
        console.log('communitys', res)
        const ccc = res.map((r) => stanfiAddress(r.communityId))
        this.saveClCommunitys(ccc)
        console.log('store comm', this.clCommunitys, ccc)
      })
    },

    getCrowdstacking () {
      // 获取验证者节点投票卡片信息 --- polkadot
      getCrowdstacking().then((res) => {
        const crowdstaking = res.map(({ community, project }) => ({
          community: {
            ...community,
            communityId: stanfiAddress(community.communityId)
          },
          project: {
            ...project,
            projectId: stanfiAddress(project.projectId),
            validators: project.validators.map((v) => stanfiAddress(v))
          }
        }))
        this.saveCrowdstakings(crowdstaking)
        this.saveCommunitys(
          crowdstaking.map(({ community }) => community.communityId)
        )
        this.saveProjects(crowdstaking.map(({ project }) => project.projectId))
        let validators = crowdstaking.map(({ project }) => project.validators)
        validators = validators.reduce((t, v) => t.concat(...v), [])
        validators = [...new Set(validators)]
        getValidatorsInfo(validators)
      })
    }
  },
  watch: {
    screenWidth (val) {
      this.screenWidth = val
    }
  },
  async mounted () {
    const _this = this
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        _this.screenWidth = window.screenWidth
      })()
    }
    this.setLanguage(localStorage.getItem(LOCALE_KEY))
    this.getCommnunitys()
    this.getCrowdstacking()
  },
  async created () {
    await Promise.all([subPolkadotBlock(), subKusamaBlock()])
    await loadPolkadotAccounts()
  }
}
</script>

<style lang="scss">
$blue: #ffdb1b;
:root {
  --yellow-background: #f5ecd8;
  --primary-custom: #ffdb1b;
  --primary: #ffdb1b;
  --primary-text: #242629;
  --secondary-text: #717376;
  --disable: #bdbfc2;
  --dividers: #e3e5e8;
  --background: #f6f7f9;
  --error: #ff5040;
  --success: #50bf00;
  --link: #408fff;
  --warning: #ff9500;
  --backgroud-state: #b37012;
}
@import "static/css/responsive";
@import "static/css/common.scss";
@import "static/css/layout";
@import "~bootstrap/scss/bootstrap.scss";
@import "~bootstrap-vue/src/index.scss";
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
#dropdown-1 .dropdown-toggle {
  border-color: #F6F7F9;
  background: #F6F7F9;
  border-radius: .8rem;
  outline: none;
  &::after {
    display: none;
  }
}
#dropdown-1 .dropdown-menu {
  width: 100%;
  border-color: transparent;
  border-radius: 1rem;
  box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.1);
  .dropdown-item {
    padding: .6rem 1.2rem;
    &:hover {
      background: rgba(255, 219, 38, 0.05);
    }
  }
}
.c-tooltip {
  @include c-flex-between-center;
  span:first-child {
    font-weight: bold;
    min-width: 5rem;
  }
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
}

#justswap-icon {
  background-image: url("./static/images/just-swap.svg");
}
#github-icon {
  background-image: url("./static/images/GitHub.svg");
}
#docs-icon {
  background-image: url("./static/images/docs.svg");
}
#discord-icon {
  background-image: url("./static/images/Discord.svg");
}
#telegram-icon {
  background-image: url("./static/images/telegram.svg");
}

#justswap-icon:hover {
  background-image: url("./static/images/just-swap-hover.svg");
}
#github-icon:hover {
  background-image: url("./static/images/GitHub-hover.svg");
}
#docs-icon:hover {
  background-image: url("./static/images/docs-hover.svg");
}
#discord-icon:hover {
  background-image: url("./static/images/Discord-hover.svg");
}
#telegram-icon:hover {
  background-image: url("./static/images/telegram-hover.svg");
}
</style>
