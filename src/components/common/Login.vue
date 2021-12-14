<template>
  <transition name="fade">
    <div class="mask" @click.self="hideMask">
      <div class="login">
        <!-- keychain login -->
        <p>{{ this.$t("operation.login") }}</p>
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
              v-show="isLoging"
            ></b-spinner>
            {{ $t('commen.loginByKeychain') }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>

export default {
  name: 'Login',
  data () {
    return {
      loginBtnText: '',
      loginByKeychainBtnText: '',
      isLoging: false,
      keychainAccount: '',
      tipTitle: '',
      tipMessage: '',
      canDismissTip: true
    }
  },
  props: {
    type: {
      type: String,
      default: 'STEEM'
    }
  },
  computed: {
    keychainLogo () {
      if (this.type === 'STEEM') {
        return {
          backgroundImage:
            'url(' + require('@/static/images/keychain.png') + ')'
        }
      } else {
        return {
          backgroundImage:
            'url(' + require('@/static/images/hive-keychain.png') + ')'
        }
      }
    }
  },
  methods: {
    getKeychain () {
      const url =
        this.type === 'STEEM'
          ? 'https://chrome.google.com/webstore/detail/steem-keychain/lkcjlnjfpbikmcmbachjpdbijejflpcm'
          : 'https://chrome.google.com/webstore/detail/hive-keychain/jcacnejopjdphbnjgfaaobbfafkihpep?hl=zh-CN'
      window.open(url, '_blank')
    },

    loginByKeychain () {
      if (this.keychainAccount.length === 0) {
        return
      }
      const message = `nutbox_login-${Math.floor(
        100000000 + Math.random() * 900000000
      )}`
      this.isLoging = true
      const that = this;
      (this.type === 'STEEM'
        ? steem_keychain
        : hive_keychain
      ).requestSignBuffer(
        this.keychainAccount,
        message,
        'Active',
        async function (res) {
          if (res.success === true) {
            const ress = await that.$store.dispatch(
              that.type === 'STEEM'
                ? 'steem/initializeSteemAccount'
                : 'hive/initializeHiveAccount',
                res.data.username
            )
            if (!ress) {
              that.tipTitle = that.$t('error.error')
              that.tipMessage = that.$t(
                'error.' + that.type.toLowerCase() + 'LoginFail'
              )
              that.$bvToast.toast(that.tipMessage, {
                title: that.tipTitle,
                variant: 'danger'
              })
              return
            }
            that.$emit('hideMask')
          } else {
            if (res.error === 'user_cancel') {
              that.tipTitle = that.$t('error.error')
              that.tipMessage = that.$t('error.unlockKeychain')
              that.$bvToast.toast(that.tipMessage, {
                title: that.tipTitle,
                variant: 'danger'
              })
            } else {
              that.tipTitle = that.$t('error.error')
              that.tipMessage = that.$t(
                'error.' + that.type.toLowerCase() + 'LoginFail'
              )
              that.$bvToast.toast(that.tipMessage, {
                title: that.tipTitle,
                variant: 'danger'
              })
            }
          }
          that.isLoging = false
        }
      )
    },
    hideMask () {
      if (this.isLoging) return
      this.$emit('hideMask')
    }
  },
  async mounted () {
    this.loginBtnText = this.$t('commen.login')
  }
}
</script>

<style lang="less" scoped>
.login {
  margin-top: -15%;
  width: 492px;
  height: 262px;
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
