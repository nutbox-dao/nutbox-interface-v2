<template>
  <div class="page-view-content crowdstaking">
    <div class="page-view-title">{{$t("cs.crowdstaking") }}</div>
      <div class="loading-bg" v-if="loading">
        <img src="~@/static/images/loading.gif" alt="" />
        <p class="font16">{{ $t("tip.loading") }}</p>
      </div>
      <template v-else>
        <div class="nav-box container">
          <div class="nav">
            <router-link to="/crowdstaking/deposite">Deposite</router-link>
            <router-link to="/crowdstaking/steem-delegate">Steem Delegate</router-link>
            <router-link to="/crowdstaking/hive-delegate">Hive Delegate</router-link>
            <router-link to="/crowdstaking/nominate">Nominate</router-link>
            <router-link to="/crowdstaking/crowdloan">Crowdloan</router-link>
            <div class="center-blank"></div>
        </div>
        <component :is='$route.name'/>
      </div>
    <router-view></router-view>
      </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import SteemAccount from '@/components/Accounts/SteemAccount'
import HiveAccount from '@/components/Accounts/HiveAccount'
import PolkadotAccount from '@/components/Accounts/PolkadotAccount'
import BSCAccount from '@/components/Accounts/BSCAccount'

export default {
  name: "Home",
  computed: {
    ...mapState('web3',["communityCard"]),
    funds() {
      const fundInfos = this.getFundInfos();
      return fundInfos || [];
    },
  },
  computed: {
    loading() {
      return this.communityCard === null
    }
  },
  components: {
    crowdloan: PolkadotAccount,
    nominate: PolkadotAccount,
    'steem-delegate': SteemAccount,
    'hive-delegate': HiveAccount,
    deposite: BSCAccount
  },
  methods: {
  },
  created () {
  },
};
</script>

<style lang="less" scoped>
</style>
