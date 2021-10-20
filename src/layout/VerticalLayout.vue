<template>
  <div class="page-layout">
    <div class="page-header-v flex-between-center" v-if="screenWidth < 992">
      <div class="header-brand">
        <img class="logo" src="~@/static/images/logo_small.png" alt="nutbox" />
        <img
          class="menu ml-2"
          src="~@/static/images/menu.png"
          alt=""
          v-b-toggle.sidebar-menu
        />
      </div>
    </div>
    <b-sidebar id="sidebar-menu" no-header :backdrop="screenWidth < 992">
      <div class="menu-box">
        <div class="header-brand menu-logo flex-start-center">
          <img
            :src="showCommunity && allCommunities[0].icon"
            @click="gotoOfficial"
            alt="nutbox"
          />
          <span class="text-left font-weight-bolder font16">{{
            showCommunity && allCommunities[0].name
          }}</span>
        </div>
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
            <b-nav-item v-if="showBlog" to="/specify/blog">
              <i id="blog-icon" class="menu-icon" />
              <span>{{ $t("commen.blog") }}</span>
            </b-nav-item>
            <b-nav-item v-if="showNps" to="/specify/nps">
              <i id="nps-icon" class="menu-icon" />
              <span>{{ $t("nps.nps") }}</span>
            </b-nav-item>
            <b-nav-item v-if="showGame" to="/specify/game">
              <i id="game-icon" class="menu-icon" />
              <span>{{ $t('game.game') }}</span>
            </b-nav-item>
          </b-nav>
          <div class="bottom">
            <div class="links">
              <a
                id="github-icon"
                v-if="showGithub"
                :href="allCommunities[0].github"
                target="_blank"
              >
                <b-popover
                  target="github-icon"
                  triggers="hover focus"
                  placement="top"
                >
                  Github
                </b-popover>
              </a>
              <a
                id="docs-icon"
                v-if="showDocument"
                :href="allCommunities[0].document"
                target="_blank"
              >
                <b-popover
                  target="docs-icon"
                  triggers="hover focus"
                  placement="top"
                >
                  {{ $t("commen.docs") }}
                </b-popover>
              </a>
              <a
                id="discord-icon"
                v-if="showDiscord"
                :href="allCommunities[0].discord"
                target="_blank"
              >
                <b-popover
                  target="discord-icon"
                  triggers="hover focus"
                  placement="top"
                >
                  Discord
                </b-popover>
              </a>
              <a
                id="telegram-icon"
                v-if="showTelegram"
                :href="allCommunities[0].telegram"
                target="_blank"
              >
                <b-popover
                  target="telegram-icon"
                  triggers="hover focus"
                  placement="top"
                >
                  Telegram
                </b-popover>
              </a>
              <a
                id="facebook-icon"
                v-if="showFacebook"
                :href="allCommunities[0].facebook"
                target="_blank"
              >
                <b-popover
                  target="telegram-icon"
                  triggers="hover focus"
                  placement="top"
                >
                  Facebook
                </b-popover>
              </a>
              <a
                id="twitter-icon"
                v-if="showTwitter"
                :href="allCommunities[0].twitter"
                target="_blank"
              >
                <b-popover
                  target="telegram-icon"
                  triggers="hover focus"
                  placement="top"
                >
                  Twitter
                </b-popover>
              </a>
            </div>
            <div class="h-line"></div>
            <div class="settings">
              <b-dropdown
                :no-flip="true"
                offset="50"
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
import { LOCALE_KEY } from "@/config";
import TipMessage from "../components/ToolsComponents/TipMessage";
import { mapState, mapMutations, mapActions } from "vuex";
import Identicon from "@polkadot/vue-identicon";

import { getMyCommunityProposalConfigInfo } from "@/utils/web3/communityProposalConfig";
import { getAllGame } from "@/utils/web3/game";
import { hexToRgb } from "@/utils/commen/util";

export default {
  data() {
    return {
      tipMessage: "",
      tipTitle: "",
      showMessage: false,
      accountsPop: false,
      screenWidth: document.body.clientWidth,
      communityProposalConfigInfo: null,
      games: null,
    };
  },
  computed: {
    ...mapState("polkadot", [
      "isConnected",
      "allAccounts",
      "account",
      "crowdstakings",
      "communitys",
      "projects",
    ]),
    ...mapState("polkadot", ["clCommunitys"]),
    ...mapState(["lang"]),
    ...mapState("web3", ["allCommunities"]),
    address() {
      if (this.$store.state.web3.account) {
        return this.formatUserAddress(this.$store.state.web3.account, false);
      }
    },
    showMenu() {
      return this.screenWidth > 960;
    },
    showCommunity() {
      return !!(this.allCommunities && this.allCommunities[0]);
    },
    showGithub() {
      return (
        this.showCommunity &&
        this.allCommunities[0].github &&
        this.allCommunities[0].github.indexOf("https://github.com") !== -1
      );
    },
    showDocument() {
      return (
        this.showCommunity &&
        this.allCommunities[0].document &&
        this.allCommunities[0].document !== "null" &&
        this.allCommunities[0].document !== "undefined"
      );
    },
    showDiscord() {
      return (
        this.showCommunity &&
        this.allCommunities[0].discord &&
        this.allCommunities[0].discord !== "null" &&
        this.allCommunities[0].discord !== "undefined"
      );
    },
    showTelegram() {
      return (
        this.showCommunity &&
        this.allCommunities[0].telegram &&
        this.allCommunities[0].telegram !== "null" &&
        this.allCommunities[0].telegram !== "undefined"
      );
    },
    showFacebook() {
      return (
        this.showCommunity &&
        this.allCommunities[0].facebook &&
        this.allCommunities[0].facebook !== "null" &&
        this.allCommunities[0].facebook !== "undefined"
      );
    },
    showTwitter() {
      return (
        this.showCommunity &&
        this.allCommunities[0].twitter &&
        this.allCommunities[0].twitter !== "null" &&
        this.allCommunities[0].twitter !== "undefined"
      );
    },
    showBlog() {
      return (
        this.showCommunity &&
        this.allCommunities[0].blogTag &&
        this.allCommunities[0].blogTag &&
        this.allCommunities[0].blogTag.indexOf("hive-") !== -1
      );
    },
    showNps() {
      return (
        this.communityProposalConfigInfo &&
        this.communityProposalConfigInfo !== "null" &&
        this.communityProposalConfigInfo != "undefined"
      );
    },
    showGame() {
      return this.games && this.games !== "null" && this.games != "undefined";
    },
  },
  components: {
    TipMessage,
    Identicon,
  },
  async mounted() {
    const _this = this;

    this.id = this.$router.currentRoute.params.key
      ? this.$router.currentRoute.params.key
      : this.$route.query.id;

    this.communityProposalConfigInfo = await getMyCommunityProposalConfigInfo(
      this.id
    );
    if(this.allCommunities && this.allCommunities[0] && this.allCommunities[0].color){
      this.setThemeColor(this.allCommunities[0].color)
    }
    this.games = await getAllGame(this.id);
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        _this.screenWidth = window.screenWidth;
      })();
    };
  },
  methods: {
    ...mapMutations("polkadot", [
      "saveCrowdstakings",
      "saveCommunitys",
      "saveProjects",
      "saveAccount",
    ]),
    ...mapMutations("polkadot", ["saveClCommunitys"]),
    ...mapActions("steem", ["setVestsToSteem"]),
    ...mapActions("hive", ["setVestsToHive"]),
    async gotoOfficial() {
      // test()
      // window.open('https://nutbox.io', '_blank')
    },
    setThemeColor (color) {
      if(color) {
        const root = document.documentElement
        root.style.setProperty('--primary-custom', `${color}`)
        root.style.setProperty('--primary-custom-rgb', hexToRgb(`${color}`))
      }
    },
    setLanguage(lang) {
      localStorage.setItem(LOCALE_KEY, lang);
      this.$store.commit("saveLang", lang);
      this.$i18n.locale = lang;
    },
    formatUserAddress(address, long = true) {
      if (!address) return "Loading Account";
      if (long) {
        if (address.length < 16) return address;
        const start = address.slice(0, 28);
        const end = address.slice(-5);
        return `${start}...`;
      } else {
        const start = address.slice(0, 6);
        const end = address.slice(-6);
        return `${start}...${end}`;
      }
    },
  },
  watch: {
    screenWidth(val) {
      this.screenWidth = val;
    },
    allCommunities(val) {
      if (val && val.length > 0){
        console.log(33, val);
        const color = val[0].color;
        this.setThemeColor(color)
      }
    }
  },
};
</script>
<style lang="scss">
@import "src/static/css/layout-v";
</style>
<style lang="scss" scoped>
#justswap-icon {
  background-image: url("~@/static/images/just-swap.svg");
}
#github-icon {
  background-image: url("~@/static/images/GitHub.svg");
}
#docs-icon {
  background-image: url("~@/static/images/docs.svg");
}
#discord-icon {
  background-image: url("~@/static/images/Discord.svg");
}
#telegram-icon {
  background-image: url("~@/static/images/telegram.svg");
}
#facebook-icon {
  background-image: url("~@/static/images/facebook.png");
}

#justswap-icon:hover {
  background-image: url("~@/static/images/just-swap-hover.svg");
}
#github-icon:hover {
  background-image: url("~@/static/images/GitHub-hover.svg");
}
#docs-icon:hover {
  background-image: url("~@/static/images/docs-hover.svg");
}
#discord-icon:hover {
  background-image: url("~@/static/images/Discord-hover.svg");
}
#telegram-icon:hover {
  background-image: url("~@/static/images/telegram-hover.svg");
}
</style>
