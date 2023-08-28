<template>
  <div class="login-view">
    <div v-if="authStep==='login'">
      <div class="join-tip s-title">
        {{$t('signInView.join')}}
      </div>
      <button @click="login" :disabled="loging"
              class="primary-btn twitter-auth-btn w-75 mx-auto mt-4 mb-3">
        <img class="icon-twitter"
             src="~@/static/images/icon-twitter-white.svg" alt="">
        <span>{{$t('signInView.signInWithTwitter')}}</span>
        <b-spinner v-show="loging" small />
      </button>
      <div class="text-center text-grey-7" style="word-break: break-word">{{$t('signInView.p1')}}</div>
    </div>
    <div v-else-if="authStep === 'select'">
      <div class="d-flex justify-content-center align-items-center">
        <img v-if="pendingAccount.profileImg"
             :src="pendingAccount.profileImg" @error="replaceEmptyImg" alt=""
             class="twitter-avatar"/>
        <img v-else src="~@/static/images/avatar-1.png" alt=""
             class="twitter-avatar"/>
        <div class="d-flex flex-column align-items-start">
            <span class="font18">
              {{pendingAccount.twitterName}}
            </span>
          <span class="font14 text-grey-7">@{{pendingAccount.twitterUsername}}</span>
        </div>
      </div>
      <div class="s-title my-3">
        {{$t('signUpView.p1')}}
      </div>
      <button @click="connectMetamask" :disabled="connecting"
              class="primary-btn twitter-auth-btn w-75 mx-auto mt-4 mb-3">
        <img class="icon-twitter" src="~@/static/images/icon-metamask.png" alt="">
        <span class="mr-2">{{$t('signUpView.metamask')}}</span>
        <b-spinner v-show="connecting" small />
      </button>
    </div>
    <MetaMaskAccount v-else-if="authStep==='metamask'"
                     :address="walletAddress"
                     :pair="pair"
                     @back="authStep='login'"
                     @skip="$emit('close')"/>
  </div>
</template>

<script>
import { sleep } from '@/utils/helper'
// import { twitterLogin, twitterAuth, testTwitterAuth } from '@/api/api'
import Cookie from 'vue-cookies'
import MetaMaskAccount from '@/components/common/MetaMaskAccount'
import { connectMetamask } from '@/utils/web3/web3'
import { ethers } from 'ethers'
import { mapState } from 'vuex'
import emptyAvatar from '@/static/images/avatar-1.png'

export default {
  name: 'Login',
  components: { MetaMaskAccount },
  data () {
    return {
      loging: false,
      showRegistering: false,
      showNotSendTwitter: false,
      connecting: false,
      authStep: 'login',
      generatingKeys: false,
      showPrivateKey: false,
      ethAddress: '',
      accountInfo: {},
      walletAddress: '',
      wallet: {},
      pair: {},
      pendingAccount: {},
      thirdPartInfo: {}
    }
  },
  mounted () {
    const loginInfo = Cookie.get('account-auth-info')
    const thirdPartInfo = Cookie.get('partner-info')
    if (loginInfo) {
      this.pendingAccount = loginInfo
      if (thirdPartInfo) {
        this.thirdPartInfo = thirdPartInfo
        this.connectMetamask()
        return
      }
      this.authStep = 'select'
    }
  },
  beforeUnmount () {
    Cookie.remove('account-auth-info')
  },
  unmounted () {
    Cookie.remove('account-auth-info')
  },
  computed: {
    ...mapState(['referee'])
    // ...mapGetters(['getPrivateKey'])
  },
  methods: {
    replaceEmptyImg (e) {
      e.target.src = emptyAvatar
    },
    showNotify (message, duration, type) {
      this.$bvToast.toast(message, { autoHideDelay: duration })
    },
    async login () {
      const timeoutTip = this.$t('err.loginTimeout')
      this.$gtag.event('login', {
        method: 'login'
      })
      try {
        const isIOS = navigator.userAgent.toUpperCase().indexOf('IPHONE') >= 0
        const isAndroid = navigator.userAgent.toUpperCase().indexOf('ANDROID') >= 0

        console.log(navigator.userAgent)
        const source = this.$route.query?.utm_source

        this.loging = true
        let needLogin = false
        if (isIOS && (source === 'tokenpocket' || (navigator.userAgent.indexOf('TokenPocket_iOS') >= 0))) {
          console.log('token pocket')
        }
        if (isAndroid || isIOS) {
          needLogin = true
          // const res = await twitterAuth(true);
          // window.location.href = res;
          // return;
        }

        const res = await twitterAuth({ needLogin, referee: this.referee })
        const params = res.split('?')[1].split('&')
        let state
        for (const p of params) {
          const [key, value] = p.split('=')
          if (key === 'state') {
            state = value
            break
          }
        }
        if (isIOS || isAndroid) {
          setTimeout(() => {
            window.location.href = res
          })
        } else {
          setTimeout(() => {
            window.open(res, 'newwindow', 'height=700,width=500,top=0,left=0,toolbar=no,menubar=no,resizable=no,scrollbars=no,location=no,status=no')
          })
        }

        await sleep(1)
        randomWallet().then(wallet => this.wallet = wallet)
        createKeypair().then(pair => this.pair = pair)
        await sleep(5)

        let count = 0
        let userInfo = await twitterLogin(state)
        if (userInfo.code === 1) {
          while (count < 80) {
            userInfo = await twitterLogin(state)
            if (userInfo.code === 0) {
              // not registry
              // store auth info
              console.log('not register')
              Cookie.set('account-auth-info', JSON.stringify(userInfo.account), '180s')
              this.pendingAccount = userInfo.account
              this.authStep = 'select'
              return
            } else if (userInfo.code === 3) { // log in
              this.$store.commit('saveAccountInfo', userInfo.account)
              this.$bus.emit('login')
              this.$emit('close')
              return
            }
            count++
            await sleep(1)
          }
          // time out
          this.showNotify(timeoutTip, 5000, 'error')
          return
        } else {
          if (userInfo.code === 0) {
            // not registry
            // store auth info
            console.log('not register')
            Cookie.set('account-auth-info', JSON.stringify(userInfo.account), '180s')
            this.pendingAccount = userInfo.account
            this.authStep = 'select'
          } else if (userInfo.code === 3) { // log in
            this.$store.commit('saveAccountInfo', userInfo.account)
            this.$bus.emit('login')
            this.$emit('close')
          }
        }
      } catch (e) {
        // login error
        this.showNotify(e.toString(), 5000, 'error')
      } finally {
        this.loging = false
      }
    },
    async connectMetamask () {
      try {
        this.connecting = true
        const acc = await connectMetamask()
        this.walletAddress = ethers.utils.getAddress(acc[0])
        this.authStep = 'metamask'
      } catch (e) {
        console.log('connect metamask fail', e)
        this.showNotify(e, 5000, 'error')
      } finally {
        this.connecting = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.login-view {
  //padding-top: 2rem;
  min-height: 270px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
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
.twitter-auth-btn {
  height: 2.8rem;
}
.icon-twitter {
  width: 1.2rem;
  margin-right: 5px;
}
.twitter-avatar {
  background-color: rgba(black, 0.1);
  width: 4rem;
  height: 4rem;
  border-radius: 4rem;
  min-width: 4rem;
  min-height: 4rem;
  margin-right: 0.5rem;
}
</style>
