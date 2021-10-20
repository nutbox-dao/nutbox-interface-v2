//  Walnut page

<template>
  <div class="page-layout">
    <div class="page-header-h">
      <b-navbar toggleable="lg">
        <div class="m-logo">
          <div class="d-flex align-items-center">
            <b-navbar-brand to="/home" class="m-0">
              <img class="logo" src="~@/static/images/logo_small.png"
                   @click="gotoOfficial" alt="nutbox" />
            </b-navbar-brand >
            <img class="menu ml-2" src="~@/static/images/menu.png" alt=""  v-b-toggle.nav-collapse/>
          </div>
        </div>
        <div class="pc-logo">
          <b-navbar-brand to="/">
            <img src="~@/static/images/logo.png" alt="" class="logo">
          </b-navbar-brand>
        </div>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav align="center" class="top">
            <b-nav-item to="/community">
              <span>{{ $t("cs.community") }}</span>
            </b-nav-item>
            <b-nav-item to="/crowdstaking">
              <span>{{ $t("commen.crowdstaking") }}</span>
            </b-nav-item>
            <b-nav-item to="/blog">
              <span>{{ $t("commen.blog") }}</span>
            </b-nav-item>
            <b-nav-item to="/dapp">
              <span>{{ $t('commen.dappStore') }}</span>
            </b-nav-item>
            <b-nav-item to="/nps">
              <span>{{ $t("nps.nps") }}</span>
            </b-nav-item>
            <b-nav-item v-show="address" to="/wallet">
              <span>{{ $t("wallet.wallet") }}</span>
            </b-nav-item>
            <b-nav-item to="/community-setting" v-show="stakingFactoryId && stakingFactoryId.length > 0">
              <i id="setting-icon" class="menu-icon" />
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
        <b-navbar-nav class="d-flex flex-row align-items-center header-right">
          <div class="address-box" @click="connect">
            <i class="wallet-icon"></i>
            <div>{{ address || $t("commen.connectMetamask") }}</div>
          </div>
          <b-nav-item-dropdown variant="text" class="setting-dropdown m-0"
                               @hidden="langActive=false"
                               right no-caret>
            <template #button-content>
              <i class="more-setting-icon"></i>
            </template>
            <div v-show="!langActive">
              <b-dropdown-item href="https://github.com/nutbox-dao" target="_blank" >
                <i class="dropdown-item-icon" id="github-icon"></i>
                <span>Github</span>
              </b-dropdown-item>
              <b-dropdown-item href="https://docs.nutbox.io/white_paper/" target="_blank">
                <i class="dropdown-item-icon" id="docs-icon"></i>
                <span>{{ $t("commen.docs") }}</span>
              </b-dropdown-item>
              <b-dropdown-item href="https://discord.com/invite/zPkMuGY" target="_blank">
                <i class="dropdown-item-icon" id="discord-icon"></i>
                <span>Discord</span>
              </b-dropdown-item>
              <b-dropdown-item href="https://t.me/nutbox_defi" target="_blank">
                <i class="dropdown-item-icon" id="telegram-icon"></i>
                <span>Telegram</span>
              </b-dropdown-item>
              <div class="dropdown-item" @click="langActive=true">
                <i class="dropdown-item-icon" id="language-icon"></i>
                <span>{{$t('commen.language')}}</span>
              </div>
            </div>
            <div v-show="langActive">
              <div class="back-item" @click="langActive=false">
                <i id="back-icon"></i>
              </div>
              <b-dropdown-item @click="setLanguage(lang)"
                   v-for="lang of langOptions" :key="lang">
                {{ $t(`commen.${lang}`) }}
              </b-dropdown-item>
            </div>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-navbar>
    </div>
    <TipMessage
      :showMessage="tipMessage"
      :title="tipTitle"
      v-if="showMessage"
      @hideMask="showMessage = false"
    />
    <div class="page-container page-container-h">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import TipMessage from '../components/ToolsComponents/TipMessage'
import { mapState, mapMutations, mapActions } from 'vuex'
import Identicon from '@polkadot/vue-identicon'
import { setupNetwork } from '@/utils/web3/web3'
import { LOCALE_KEY } from "@/config";
import { getMyStakingFactory } from '@/utils/web3/community'

export default {
  name: 'VerticalLayout',
  data () {
    return {
      tipMessage: '',
      tipTitle: '',
      showMessage: false,
      accountsPop: false,
      langActive: false,
      langOptions: ['zh', 'en', 'kr', 'es', 'my', 'jp']
    }
  },
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
    address () {
      if (this.$store.state.web3.account) {
        return this.formatUserAddress(this.$store.state.web3.account, false)
      }
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
    ...mapMutations('polkadot', ['saveClCommunitys']),
    ...mapActions('steem', ['setVestsToSteem']),
    ...mapActions('hive', ['setVestsToHive']),
    async gotoOfficial () {
      console.log(this.prices)
      window.open('https://nutbox.io', '_blank')
    },
    setLanguage (lang) {
      this.langActive = false
      localStorage.setItem(LOCALE_KEY, lang)
      this.$store.commit('saveLang', lang)
      this.$i18n.locale = lang
    },
    connect () {
      if (this.address) {
        navigator.clipboard.writeText(this.$store.state.web3.account).then(() => {
          this.$bvToast.toast(
            this.$t('tip.copyAddress', {
              address: this.formatUserAddress(this.address)
            }),
            {
              title: this.$t('tip.clipboard'),
              autoHideDelay: 5000,
              variant: 'info' // info success danger
            }
          )
        }, (e) => {
          console.log(e)
        })
        return
      }
      setupNetwork()
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
    }
  },
  mounted () {
    getMyStakingFactory();
  },
}
</script>

<style lang="scss">
@import "src/static/css/layout-h";
</style>
<style lang="scss" scoped>
.back-item {
  padding: 0 .6rem;
}
#back-icon {
  @include icon(.8rem, .8rem);
  background-image: url("~@/static/images/back-blcak-arrow.svg");
}
#github-icon {
  background-image: url("~@/static/images/h-github.svg");
}
#docs-icon {
  background-image: url("~@/static/images/h-docs.svg");
}
#discord-icon {
  background-image: url("~@/static/images/h-discord.svg");
}
#telegram-icon {
  background-image: url("~@/static/images/h-telegram.svg");
}
#language-icon {
  background-image: url("~@/static/images/h-language.svg");
}
</style>
