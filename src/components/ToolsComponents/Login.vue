<template>
  <transition name="fade">
    <div class="mask" @click.self="hideMask">
      <div class="login">
        <!-- keychain login -->
        <p>{{ this.$t("commen.userlogin") }}</p>
        <div class="mt-5">
          <div class="account-box">
            <span class="keychain" :style="keychainLogo" @click="getKeychain" />
            <b-input
              class="mr-sm-2 mb-sm-0 input"
              :placeholder="
                type === 'STEEM'
                  ? $t('commen.steemAccoutPlaceHolder')
                  : $t('commen.hiveAccountPlaceHolder')
              "
              v-model="keychainAccount"
            ></b-input>
          </div>
          <button
            class="login-btn primary-btn"
            @click="loginByKeychain"
            :disabled="isLoging"
          >
            <b-spinner
              small
              type="grow"
              v-show="isLogingByKeyChain"
            ></b-spinner>
            {{ $t('commen.loginByKeychain') }}
          </button>
        </div>
        <!-- Active login -->
        <div style="margin-top: 2rem">
          <div class="account-box mb-3">
            <b-input
              class="mr-sm-2 mb-sm-0 input-active"
              :placeholder="type === 'STEEM' ? $t('commen.steemAccoutPlaceHolder') : $t('commen.hiveAccountPlaceHolder')"
              v-model="steemAccount"
            ></b-input>
          </div>
          <div class="account-box">
            <b-input
              class="mb-2 mr-sm-2 mb-sm-0 input-active"
              :placeholder="type === 'STEEM' ? $t('commen.steemActiveKeyPlaceHolder') : $t('commen.hiveActiveKeyPlaceHolder')"
              v-model="steemActiveKey"
            ></b-input>
          </div>
          <button
            class="login-btn primary-btn"
            @click="login"
            :disabled="isLoging"
          >
            <b-spinner
              small
              type="grow"
              v-show="isLogingByActiveKey"
            ></b-spinner>
            {{ this.loginBtnText }}
          </button>
        </div>
      </div>
      <TipMessage
        :showMessage="tipMessage"
        :title="tipTitle"
        v-if="showMessage"
        @hideMask="showMessage = false"
        :canDiss="canDismissTip"
      />
    </div>
  </transition>
</template>

<script>
import TipMessage from "./TipMessage";
import { verifyNameAndKey as verifySteemKey } from "@/utils/steem/steem";
import { verifyNameAndKey as verifyHiveKey } from "@/utils/hive/hive";

export default {
  name: "Login",
  data() {
    return {
      loginBtnText: "",
      loginByKeychainBtnText: "",
      isLoging: false,
      isLogingByKeyChain: false,
      isLogingByActiveKey: false,
      keychainAccount: "",
      steemAccount: "",
      steemActiveKey: "",
      tipTitle: "",
      tipMessage: "",
      showMessage: false,
      canDismissTip: true,
    };
  },
  props: {
    type: {
      type: String,
      default: "STEEM",
    },
  },
  computed: {
    keychainLogo() {
      if (this.type === "STEEM") {
        return {
          backgroundImage:
            "url(" + require("@/static/images/keychain.png") + ")",
        };
      } else {
        return {
          backgroundImage:
            "url(" + require("@/static/images/hive-keychain.png") + ")",
        };
      }
    },
  },
  components: {
    TipMessage,
  },
  methods: {
    getKeychain() {
      const url =
        this.type === "STEEM"
          ? "https://chrome.google.com/webstore/detail/steem-keychain/lkcjlnjfpbikmcmbachjpdbijejflpcm"
          : "https://chrome.google.com/webstore/detail/hive-keychain/jcacnejopjdphbnjgfaaobbfafkihpep?hl=zh-CN";
      window.open(url, "_blank");
    },
    async login() {
      const userName = this.steemAccount.trim();
      const activeKey = this.steemActiveKey.trim();
      if (userName === "" || activeKey === "") {
        this.tipTitle = this.$t("error.error");
        this.tipMessage = this.$t("error.steemAccountActiveKeyEmpty");
        this.showMessage = true;
        return;
      }
      try{
        this.isLoging = true;
        this.isLogingByActiveKey = true;
        const res = this.type === 'STEEM' ? await verifySteemKey(userName, activeKey) : await verifyHiveKey(userName, activeKey);
        const that = this;
        if (res) {
        const ress = await that.$store.dispatch(
                that.type === "STEEM"
                  ? "steem/initializeSteemAccount"
                  : "hive/initializeHiveAccount",
                that.type === 'STEEM'
                ? { steemAccount: userName, activeKey: activeKey, steemLoginType: 0 }
                : { hiveAccount: userName, activeKey: activeKey, hiveLoginType: 0 }
              );
              if (!ress) {
                that.tipTitle = that.$t("error.error");
                that.tipMessage = that.$t(
                  "error." + that.type.toLowerCase() + "LoginFail"
                );
                that.showMessage = true;
                that.isLoging = false;
                return;
              }
              that.$emit("hideMask");
        } else {
          that.tipTitle = that.$t("error.error");
          that.tipMessage = that.$t(this.type === 'STEEM' ? "error.steemLoginFail" : "error.hiveLoginFail");
          that.showMessage = true;
        }
      } catch(e){
        this.tipTitle = that.$t("error.error");
        this.tipMessage = that.$t(this.type === 'STEEM' ? "error.steemLoginFail" : "error.hiveLoginFail");
        this.showMessage = true;
      } finally{
        this.isLoging = false;
        this.isLogingByActiveKey = false;
      }
    },

    loginByKeychain() {
      if (this.keychainAccount.length === 0) {
        return;
      }
      const message = `nutbox_login-${Math.floor(
        100000000 + Math.random() * 900000000
      )}`;
      this.isLoging = true;
      const that = this;
      (this.type === "STEEM"
        ? steem_keychain
        : hive_keychain
      ).requestSignBuffer(
        this.keychainAccount,
        message,
        "Active",
        async function (res) {
          if (res.success === true) {
            const ress = await that.$store.dispatch(
              that.type === "STEEM"
                ? "steem/initializeSteemAccount"
                : "hive/initializeHiveAccount",
              that.type === "STEEM"
               ? { steemAccount: res.data.username, activeKey: null, steemLoginType: 1 }
               : { hiveAccount: res.data.username, activeKey: null, hiveLoginType: 1 }
            );
            if (!ress) {
              that.tipTitle = that.$t("error.error");
              that.tipMessage = that.$t(
                "error." + that.type.toLowerCase() + "LoginFail"
              );
              that.showMessage = true;
              that.isLoging = false;
              return;
            }
            that.$emit("hideMask");
          } else {
            if (res.error === "user_cancel") {
              that.tipTitle = that.$t("error.error");
              that.tipMessage = that.$t("error.unlockKeychain");
              that.showMessage = true;
            } else {
              that.tipTitle = that.$t("error.error");
              that.tipMessage = that.$t(
                "error." + that.type.toLowerCase() + "LoginFail"
              );
              that.showMessage = true;
            }
          }
          that.isLoging = false;
        }
      );
    },
    hideMask() {
      if (this.isLoging) return;
      this.$emit("hideMask");
    },
  },
  async mounted() {
    this.loginBtnText = this.$t("commen.login");
  },
};
</script>

<style lang="less" scoped>
.login {
  margin-top: -15%;
  width: 492px;
  height: 462px;
  background: white;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.05);
  border-radius: 28px;
  padding: 24px;
  p {
    font-size: 20px;
  }
}
.account-box {
  display: flex;
  .keychain {
    width: 8rem;
    height: 48px;
    background-color: var(--background);
    margin-right: 2px;
    border-radius: 16px 0 0 16px;
    // background-image: url('~@/static/images/keychain.png');
    background-size: 80% auto;
    background-repeat: no-repeat;
    background-position: center;
  }
  .keychain:hover {
    background-color: var(--dividers);
    cursor: pointer;
  }
  input {
    height: 48px;
    flex: 1;
    background: var(--background);
    border: none;
  }
  .input {
    border-radius: 0 16px 16px 0;
  }
  .input-active {
    border-radius: 16px;
  }
}
.login-btn {
  width: 100%;
  margin-top: 1rem;
}
</style>
