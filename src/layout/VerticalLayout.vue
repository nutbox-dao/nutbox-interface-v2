<template>
  <div class="page-layout">
    <div class="page-header-v flex-between-center" v-if="screenWidth < 992">
      <div class="header-brand">
        <img class="logo" src="~@/static/images/logo_small.png"
             @click="gotoOfficial" alt="nutbox" />
        <img class="menu ml-2" src="~@/static/images/menu.png" alt=""  v-b-toggle.sidebar-menu/>
      </div>
    </div>
    <b-sidebar id="sidebar-menu" no-header :backdrop="screenWidth<992">
      <div class="menu-box">
        <img class="menu-logo" src="~@/static/images/logo.png" @click="gotoOfficial" alt="nutbox"/>
        <div class="menu-items">
          <b-nav vertical align="center" class="top">
            <b-nav-item to="/specify/wallet" router-tag="div">
              <i id="wallet-icon" class="menu-icon" />
              <span>{{ address || $t("wallet.wallet") }}</span>
            </b-nav-item>
            <b-nav-item to="/specify/staking" router-tag="div">
              <i id="stake-icon" class="menu-icon" />
              <span>{{ $t("commen.crowdstaking") }}</span>
            </b-nav-item>
            <b-nav-item to="/specify/blog">
              <i id="blog-icon" class="menu-icon" />
              <span>{{ $t("commen.blog") }}</span>
            </b-nav-item>
            <b-nav-item to="/specify/nps">
              <i id="nps-icon" class="menu-icon" />
              <span>{{ $t("nps.nps") }}</span>
            </b-nav-item>
          </b-nav>
          <div class="bottom">
            <div class="links">
              <a id="github-icon" href="https://github.com/nutbox-dao" target="_blank">
                <b-popover target="github-icon" triggers="hover focus" placement="top">
                  Github
                </b-popover>
              </a>
              <a id="docs-icon" href="https://docs.nutbox.io/lite_paper_v1/" target="_blank">
                <b-popover target="docs-icon" triggers="hover focus" placement="top">
                  {{ $t("commen.docs") }}
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
                  <span style="font-size: 14px">{{ $t("commen.en") }}</span>
                </b-dropdown-item>
                <b-dropdown-item @click="setLanguage('zh')">
                  <b-icon
                    style="font-size: 20px"
                    :icon="lang == 'zh' ? 'check' : 'blank'"
                    aria-hidden="true"
                  ></b-icon>
                  <span style="font-size: 14px">{{ $t("commen.zh") }}</span>
                </b-dropdown-item>
                <b-dropdown-item @click="setLanguage('kr')">
                  <b-icon
                    style="font-size: 20px"
                    :icon="lang == 'kr' ? 'check' : 'blank'"
                    aria-hidden="true"
                  ></b-icon>
                  <span style="font-size: 14px">{{ $t("commen.kr") }}</span>
                </b-dropdown-item>
                <b-dropdown-item @click="setLanguage('es')">
                  <b-icon
                    style="font-size: 20px"
                    :icon="lang == 'es' ? 'check' : 'blank'"
                    aria-hidden="true"
                  ></b-icon>
                  <span style="font-size: 14px">{{ $t("commen.es") }}</span>
                </b-dropdown-item>
                <b-dropdown-item @click="setLanguage('my')">
                  <b-icon
                    style="font-size: 20px"
                    :icon="lang == 'my' ? 'check' : 'blank'"
                    aria-hidden="true"
                  ></b-icon>
                  <span style="font-size: 14px">{{ $t("commen.my") }}</span>
                </b-dropdown-item>
                <b-dropdown-item @click="setLanguage('jp')">
                  <b-icon
                    style="font-size: 20px"
                    :icon="lang == 'jp' ? 'check' : 'blank'"
                    aria-hidden="true"
                  ></b-icon>
                  <span style="font-size: 14px">{{ $t("commen.jp") }}</span>
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
    <div class="page-container page-container-v">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { LOCALE_KEY } from '@/config'
import TipMessage from '../components/ToolsComponents/TipMessage'
import { mapState, mapMutations, mapActions } from 'vuex'
import Identicon from '@polkadot/vue-identicon'

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
    ...mapState('polkadot', ['clCommunitys']),
    ...mapState(['lang']),
    ...mapState('web3', ['allCommunities']),
    address () {
      if (this.$store.state.web3.account) {
        return this.formatUserAddress(this.$store.state.web3.account, false)
      }
    },
    showMenu () {
      return this.screenWidth > 960
    }
  },
  components: {
    TipMessage,
    Identicon
  },
  mounted() {
    const _this = this
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        _this.screenWidth = window.screenWidth
      })()
    }
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
    async gotoOfficial () {
      getAllValidators('polkadot')
      // test()
      // window.open('https://nutbox.io', '_blank')
    },
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
  },
  watch: {
    screenWidth (val) {
      this.screenWidth = val
    },
    '$route' (val) {
      this.$refs.scrollContent.scrollTo({ top: 0 })
    }
  },
}
</script>
<style lang="scss">
@import "src/static/css/layout-v";
</style>
