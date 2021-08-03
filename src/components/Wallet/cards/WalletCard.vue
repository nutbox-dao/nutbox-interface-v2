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
      <ConnectWalletBtn
        class="op-bottom"
        v-if="!hiveLogin && type=='hive'"
        type='HIVE'
        @hiveLogin="showHiveLogin = true"
      />
    <Login type='STEEM' v-if="showSteemLogin" @hideMask="showSteemLogin = false" />
    <Login type='HIVE' v-if="showHiveLogin" @hideMask="showHiveLogin = false" />
  </div>
  
</template>

<script>
import ConnectWalletBtn from '@/components/ToolsComponents/ConnectWalletBtn'
import Login from '@/components/ToolsComponents/Login'
import { mapState } from 'vuex'

export default {
  name: 'WalletCard',
  components: {
    ConnectWalletBtn,
    Login
  },
  data() {
    return {
      showSteemLogin: false,
      showHiveLogin: false,
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
    ...mapState({
      steemAccount: state => state.steem.steemAccount,
      hiveAccount: state => state.hive.hiveAccount
    }),
    steemLogin() {
      return !!this.steemAccount
    },
    hiveLogin() {
      return !!this.hiveAccount
    }
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
