<template>
  <div class="wallet-card">
    <div class="top flex-between-center">
      <img :src="logo" alt="" class="logo" />
      <div class="balance-right flex-full">
        <div class="d-flex justify-content-between align-items-start font-bold">
          <div class="d-flex flex-column align-items-start justify-content-between">
            <div class="font16">{{ symbol }}</div>
            <div class="font12 text-grey-light">{{ name }}</div>
          </div>
          <span class="font16">{{ balance }}</span>
        </div>
      </div>
    </div>
      <ConnectWalletBtn
        class="op-bottom"
        v-if="!steemLogin && type=='steem'"
        type='STEEM'
        @steemLogin="showSteemLogin = true"
      />
    <Login type='STEEM' v-if="showSteemLogin" @hideMask="showSteemLogin = false" />
  </div>
  
</template>

<script>
import ConnectWalletBtn from '@/components/ToolsComponents/ConnectWalletBtn'
import Login from '@/components/ToolsComponents/Login'

export default {
  name: 'WalletCard',
  components: {
    ConnectWalletBtn,
    Login
  },
  data() {
    return {
      showSteemLogin: false
    }
  },
  props: {
    logo: {
      type: String,
    },
    name: {
      type: String,
    },
    symbol: {
      type: String,
    },
    balance: {
      type: String,
    },
    type: {
      type: String,
      default: 'steem'
    }
  },
  computed: {
    steemLogin() {
      return !!this.steemAccount
    },
  },
}
</script>

<style scoped lang="scss">
@import "src/static/css/card/wallet-card";
.wallet-card {
  border: 2px solid transparent;
  &:hover {
    box-shadow: 0 2px 20px #FFE973;
    border: 2px solid #FFDB1B;
    box-sizing: border-box;
  }
  .top {
    margin-bottom: 0;
  }
  .btn-group {
    margin-top: 1rem;
  }
}
</style>
