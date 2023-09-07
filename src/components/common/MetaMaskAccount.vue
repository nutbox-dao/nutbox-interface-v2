<template>
  <div class="w-full h-full overflow-auto">
    <div class="mx-auto">
      <div v-if="step===1">
        <div class="s-title mb-3">{{$t('metamaskView.p1')}}</div>
        <div class="account-box d-flex justify-content-between align-items-center">
          <span class="flex-1" style="word-break: break-all">{{ account }}</span>
          <i class="copy-icon copy-icon-gray mx-1"
             @click="onCopy($t('tip.copyAddress', { address: account}), {},account)"></i>
        </div>
        <template v-if="showMismatchAddress">
          <div class="d-flex align-items-start mt-3">
            <i class="warning-icon warning-icon-gray"></i>
            <div class="whitespace-pre-line text-left text-grey-7 font14"
                 style="word-break: break-word; line-height: 1rem"
                 v-html="$t('metamaskView.p4', {account: `<strong class='text-primary-0 font-bold'>${thirdPartInfo['ethAddress'] || '0x'}</strong>`})">
            </div>
          </div>
        </template>
        <template v-else-if="isRegister">
          <div class="d-flex align-items-start mt-3">
            <i class="warning-icon warning-icon-gray"></i>
            <div class="whitespace-pre-line text-left text-grey-7 font14"
                 style="word-break: break-word; line-height: 1rem"
                 v-html="$t('metamaskView.p3', {account: `<strong class='text-primary-0 font-bold'>@${username || 'Pipi'}</strong>`})">
            </div>
          </div>
          <button v-show="!thirdPartInfo || !thirdPartInfo.ethAddress"
                  class="primary-btn primary-btn-outline mt-3"
                  @click="$emit('back')">
            {{$t('metamaskView.back')}}
          </button>
        </template>
        <template v-else>
          <div class="whitespace-pre-line text-left text-grey-7 font14 mt-2 mb-3">

          </div>
          <div class="d-flex justify-content-between align-items-center" style="column-gap: 15px">
            <button v-show="!thirdPartInfo || !thirdPartInfo.ethAddress"
                    class="flex-1 primary-btn primary-btn-outline"
                    @click="$emit('back')">
              {{$t('metamaskView.back')}}
            </button>
            <button class="flex-1 primary-btn"
                    @click="confirm"
                    :disabled="isCheckingAddress || isSigning">
              {{$t('metamaskView.confirm')}}
              <b-spinner class="ml-1" v-show="isCheckingAddress || isSigning" small />
            </button>
          </div>
        </template>
      </div>
      <div v-if="step===2">
        <template v-if="authError">
          <div class="text-center">
            <img class="auth-img mb-2" src="~@/static/images/icon-error-red.svg" alt="">
            <div class="font-bold">Error!</div>
          </div>
          <button class="primary-btn mt-3 w-75 mx-auto"
                  @click="$emit('back')">
            {{$t('metamaskView.back')}}
          </button>
        </template>
        <template v-else>
          <div class="text-center">
            <img class="auth-img mx-auto mb-3" src="~@/static/images/icon-record.svg" alt="">
            <div class="text-center font18" style="white-space: pre-line">
              {{$t('metamaskView.p5')}}
            </div>
          </div>
          <button class="primary-btn mt-3 w-75 mx-auto"
                  :disabled="isSigningup"
                  @click="signup">
            {{isSigningup?$t('metamaskView.verifying'):$t('metamaskView.verify')}}
            <b-spinner class="ml-1" v-show="isSigningup" small />
          </button>
        </template>
      </div>
      <div v-if="step===3" class="text-center">
        <img class="auth-img mb-2" src="~@/static/images/icon-success-login.svg" alt="">
        <div class="text-center font18 mb-1">
          {{$t('metamaskView.p6')}}
        </div>
        <div class="text-center font18 mb-2">
          {{$t('metamaskView.p7')}}
        </div>
        <div class="d-flex justify-content-between align-items-center" style="column-gap: 15px">
          <button class="primary-btn primary-btn-outline"
                  @click="gotoThirdPartner();$emit('skip')">
            {{$t('metamaskView.skip')}}
          </button>
          <button class="primary-btn"
                  @click="send();gotoThirdPartner()">
            {{$t('metamaskView.postBtn')}}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import showToastMixin from '@/mixins/copyToast'
import { getUserByEth, register, check } from '@/apis/wh3Api'
import { mapState, mapGetters } from 'vuex'
import { accountChanged } from '@/utils/web3/account'
import { signMessage } from '@/utils/web3/web3'
import { SignUpMessage, SendPwdServerPubKey } from '@/config'
import { ethers } from 'ethers'
import { bytesToHex } from '@/utils/code'
import { generateSteemAuth } from '@/utils/steem'
import { box, createKeypair } from '@/utils/tweet-nacl'
import Cookie from 'vue-cookies'
import { sleep } from '@/utils/helper'

export default {
  name: 'MetaMaskAccount',
  props: {
    address: {
      type: String,
      default: ''
    },
    pair: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      isRegister: false,
      step: 1,
      isCheckingAddress: false,
      username: '',
      isSigning: false,
      isSigningup: false,
      pwd: '',
      sendPubKey: '',
      salt: '',
      authError: false,
      // account: '',
      thirdPartInfo: {},
      showMismatchAddress: false
    }
  },
  computed: {
    ...mapState('web3', ['account'])
    // ...mapState(['referee']),
    // ...mapGetters(['getAccountInfo'])
  },
  watch: {
    account (newValue, oldValue) {
      if (!this.isCheckingAddress) { this.checkoutAccount() }
    }
  },
  mixins: [showToastMixin],
  methods: {
    async send () {
      window.open('https://twitter.com/intent/tweet?text=I have linked my Twitter to @wormhole_3 to help myself take ownership of my data, see this: https://alpha.wormhole3.io%0a%23iweb3', '__blank')
      this.$emit('skip')
    },
    showNotify (message, duration, type) {
      this.$bvToast.toast(message, { autoHideDelay: duration })
    },
    async confirm () {
      // this.$gtag.event('sync up with metamask', {
      //   method: 'confirm'
      // })
      if (this.isRegister) {
        this.$emit('back')
      } else {
        try {
          this.isSigning = true
          const sig = await signMessage(SignUpMessage, this.account)
          if (!sig) {
            this.showNotify(this.$t('tips.dismatchAddress'), 5000, 'error')
            return
          }
          const salt = bytesToHex(ethers.utils.randomBytes(4))
          let pair = this.pair
          await sleep(0.6)
          if (!pair.privateKey) {
            pair = await createKeypair()
          }
          const pwd = box(generateSteemAuth(sig.substring(2) + salt, this.account), SendPwdServerPubKey, pair.privateKey)
          this.pwd = pwd,
          this.salt = salt
          this.sendPubKey = pair.publicKey
          this.step = 2
        } catch (e) {
          console.log('sign message fail:', e)
        } finally {
          this.isSigning = false
        }
      }
    },
    async checkoutAccount () {
      try {
        this.isCheckingAddress = true
        const account = await getUserByEth(this.account)
        if (account && account.code === 3) {
          // registred
          this.username = account.account.twitterUsername
          this.isRegister = true
        } else {
          // not registred
          this.username = ''
          this.isRegister = false
        }
        if (this.thirdPartInfo && this.thirdPartInfo.ethAddress.toLowerCase() !== this.account.toLocaleLowerCase()) {
          this.showMismatchAddress = true
        } else {
          this.showMismatchAddress = false
        }
      } catch (e) {

      } finally {
        this.isCheckingAddress = false
      }
    },
    async signup () {
      console.log('signup')
      // this.$gtag.event('sync up with metamask', {
      //   method: 'signup'
      // })
      const loginInfo = Cookie.get('account-auth-info')
      Cookie.remove('account-auth-info')
      Cookie.remove('partner-info')
      if (loginInfo) {
        try {
          this.isSigningup = true
          const { accessToken, twitterId } = loginInfo
          const params = {
            accessToken,
            twitterId,
            referee: this.referee,
            sendPubKey: this.sendPubKey,
            pwd: this.pwd,
            ethAddress: this.account,
            isMetamask: 1,
            salt: this.salt
          }
          await register(params)
          // checkout register progress
          const res = await check({ accessToken, twitterId })
          if (res && res.code === 3) {
            this.$gtag.event('sync up with metamask ok', {
              method: 'signup'
            })
            this.$store.commit('user/saveWh3AccountInfo', res.account)
            // signup success
            this.step = 3
          }
        } catch (e) {
          console.log(532, e)
        } finally {
          this.isSigningup = false
        }
      } else {
        // not authed
        this.showNotify(this.$t('signUpView.notAuth'), 5000, 'error')
        this.step = 0
        this.$emit('back')
        this.authError = true
      }
    },
    gotoThirdPartner () {
      if (this.thirdPartInfo && this.thirdPartInfo.callback && this.getAccountInfo) {
        window.location = this.thirdPartInfo.callback.indexOf('?') === -1
          ? this.thirdPartInfo.callback + `?originalAddress=${this.thirdPartInfo.ethAddress}&twitterId=${this.getAccountInfo.twitterId}&ethAddress=${this.getAccountInfo.ethAddress}`
          : this.thirdPartInfo.callback + `&originalAddress=${this.thirdPartInfo.ethAddress}&twitterId=${this.getAccountInfo.twitterId}&ethAddress=${this.getAccountInfo.ethAddress}`
      }
    }
  },
  async mounted () {
    // this.thirdPartInfo = Cookie.get('partner-info')
    // this.account = this.address
    // this.$gtag.pageview('/metamask')
    // this.checkoutAccount()
    // await accountChanged(acc => {
    //   this.account = ethers.utils.getAddress(acc)
    // })
  }
}
</script>

<style scoped lang="scss">
.s-title {
  text-align: center;
  margin: auto;
  font-size: 1.6rem;
  line-height: 2.3rem;
  font-weight: bolder;
  background-image:-webkit-linear-gradient(left,#FADDC5,#B6B9F8);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  width: fit-content;
}
.account-box {
  border: 1px solid var(--dividers);
  border-radius: 12px;
  padding: 15px;
  background-color: var(--card-bg-primary);
  font-size: 14px;
}
.auth-img {
  width: 5rem;
  height: 5rem;
}
</style>
