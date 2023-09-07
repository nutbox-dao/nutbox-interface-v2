<template>
  <div class="login-view">
    <div v-if="!isWeb">
      <div class="join-tip s-title">
        {{$t('signInView.needWebview')}}
      </div>
      <div class="text-center text-grey-7" style="word-break: break-word">
        {{$t('signInView.changeWebview')}}
      </div>
    </div>
    <div v-else-if="authStep==='login'">
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
      <div class="text-center text-grey-7 font14" style="word-break: break-word">{{$t('signInView.p1')}}</div>
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
import { twitterLogin, twitterAuth } from '@/apis/wh3Api'
import Cookie from 'vue-cookies'
import MetaMaskAccount from '@/components/common/MetaMaskAccount'
import { connectMetamask } from '@/utils/web3/web3'
import { ethers } from 'ethers'
import { mapState } from 'vuex'
import emptyAvatar from '@/static/images/avatar-default.svg'
import { randomWallet } from '@/utils/web3/ethers'
import { createKeypair } from '@/utils/tweet-nacl'

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
      thirdPartInfo: {},
      isWeb: false
    }
  },
  mounted () {
    const loginInfo = Cookie.get('account-auth-info')
    if (loginInfo) {
      this.pendingAccount = loginInfo
      this.connectMetamask()
    }
    const isIOS = navigator.userAgent.toUpperCase().indexOf('IPHONE') >= 0
    const isAndroid = navigator.userAgent.toUpperCase().indexOf('ANDROID') >= 0
    if(isIOS || isAndroid) {
      this.isWeb = false;
    }else {
      this.isWeb = true;
    }
  },
  beforeUnmount () {
    Cookie.remove('account-auth-info')
  },
  unmounted () {
    Cookie.remove('account-auth-info')
  },
  computed: {
    ...mapState(['referee']),
    ...mapState('web3', ['account'])
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
      // this.$gtag.event('login', {
      //   method: 'login'
      // })
      try {
        if(!this.isWeb) return

        // get call back url
        let wPath = window.document.location.href;
        let pathName = this.$route.path;
        let callback = wPath.replace(pathName, '/loginsuccess')

        this.loging = true
        let needLogin = true;

        const res = await twitterAuth({ needLogin, callback })
        const params = res.split('?')[1].split('&')
        let state
        for (const p of params) {
          const [key, value] = p.split('=')
          if (key === 'state') {
            state = value
            break
          }
        }
        
        setTimeout(() => {
          window.open(res, 'newwindow', 'height=700,width=500,top=0,left=0,toolbar=no,menubar=no,resizable=no,scrollbars=no,location=no,status=no')
        })

        await sleep(1)
        randomWallet().then(wallet => this.wallet = wallet)
        createKeypair().then(pair => this.pair = pair)
        await sleep(5)

        let count = 0
        let userInfo = await twitterLogin(state)
        if (userInfo.code === 1) {
          while (count < 80) {
            userInfo = await twitterLogin(state)
            if (userInfo.code === 3) {
              // not registry
              // store auth info
              console.log('not register')
              Cookie.set('account-auth-info', JSON.stringify(userInfo.account), '180s')
              this.pendingAccount = userInfo.account
              this.connectMetamask();
              return
            } else if (userInfo.code === 3) { // log in
              this.$store.commit('user/saveWh3AccountInfo', userInfo.account)
              this.$emit('close')
              return
            }
            count++
            await sleep(2)
          }
          // time out
          this.showNotify(timeoutTip, 5000, 'error')
          return
        } else {
          if (userInfo.code === 3) {
            // not registry
            // store auth info
            console.log('not register')
            Cookie.set('account-auth-info', JSON.stringify(userInfo.account), '180s')
            this.pendingAccount = userInfo.account
            this.connectMetamask();
          } else if (userInfo.code === 3) { // log in
            this.$store.commit('user/saveWh3AccountInfo', userInfo.account)
            this.$emit('close')
          }
        }
      } catch (e) {
        // login error
        this.showNotify(e, 5000, 'error')
      } finally {
        this.loging = false
      }
    },
    async connectMetamask () {
      try {
        this.connecting = true
        const acc = await connectMetamask()
        this.walletAddress = ethers.utils.getAddress(this.account)
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
