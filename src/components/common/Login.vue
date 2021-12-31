<template>
  <div class="login position-relative custom-form">
    <i class="modal-close-icon-right" @click="$emit('hideMask')"></i>
    <!-- keychain login -->
    <div class="modal-title">
      {{ this.$t("operation.login") }}
    </div>
    <div class="mt-4">
      <div class="account-box c-input-group c-input-group-bg-dark c-input-group-border">
        <span class="keychain" :style="keychainLogo" @click="getKeychain" />
        <b-input
          class="mb-sm-0"
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
            console.log('steem login fail', res);
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

<style lang="scss" scoped>
@import "src/static/css/form";
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
}
.login-btn {
  width: 100%;
  margin-top: 1rem;
}
</style>
