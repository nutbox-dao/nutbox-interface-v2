<template>
  <div class="slider-menu">
    <div class="top">
      <div class="logo-container">
        <img
          src="./static/images/logo.png"
          style="width: 180px; height: 70px"
          alt="nutbox"
          class="logo"
        />
        <img
          src="./static/images/logo_small.png"
          style="width: 42px; height: 42px; margin-bottom: 12px"
          alt="nutbox"
          class="logo_small"
        />
      </div>
      <b-nav pills vertical align="center" class="menu">
        <b-nav-item to="/wallet" router-tag="div">
          <p id="wallet-icon" class="my-icon" />
          <span>{{ $t("wallet.wallet") }}</span>
        </b-nav-item>
        <b-nav-item to="/crowdloan">
          <p id="farming-icon" class="my-icon" />
          <span>{{ $t("cl.crowdloan") }}</span>
        </b-nav-item>
        <b-nav-item to="/crowdstaking" router-tag="div">
          <p id="stake-icon" class="my-icon" />
          <span>{{ $t("cs.crowdstaking") }}</span>
        </b-nav-item>
        <b-nav-item to="/blog">
          <p id="blog-icon" class="my-icon" />
          <span>{{ $t("commen.blog") }}</span>
        </b-nav-item>
      </b-nav>
    </div>
    <div class="bottom">
      <div class="links">
        <a
          id="github-icon"
          href="https://github.com/nutbox-dao"
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
          href="https://docs.nutbox.io/lite_paper_v1/"
          target="_blank"
        >
        </a>
        <b-popover
          target="docs-icon"
          triggers="hover focus"
          placement="top"
        >
          {{ $t("commen.docs") }}
        </b-popover>
        <a
          id="discord-icon"
          href="https://discord.com/invite/zPkMuGY"
          target="_blank"
        >
        </a>
        <b-popover
          target="discord-icon"
          triggers="hover focus"
          placement="top"
        >
          Discord
        </b-popover>
        <a
          id="telegram-icon"
          href="https://t.me/nutbox_defi"
          target="_blank"
        >
        </a>
        <b-popover
          target="telegram-icon"
          triggers="hover focus"
          placement="top"
        >
          Telegram
        </b-popover>
      </div>

      <div class="settings">
        <b-dd
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
        </b-dd>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SliderMenu'
}
</script>

<style scoped>

</style>
