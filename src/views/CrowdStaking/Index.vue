<template>
  <div class="page-view-content crowdstaking">
    <div class="page-view-title">{{$t("cs.crowdstaking") }}</div>
      <div class="nav-box container">
        <div class="nav">
          <router-link to="/crowdstaking/kusama">Crowdloan</router-link>
          <router-link to="/crowdstaking/polkadot">Nominate</router-link>
          <router-link to="/crowdstaking/delegate">Delegate</router-link>
          <router-link to="/crowdstaking/nominate">Deposite</router-link>
          <div class="center-blank"></div>
      </div>
      <component :is='$route.name'/>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapMutations, mapState, mapGetters } from "vuex";
import SteemAccount from '@/components/Accounts/SteemAccount'
import PolkadotAccount from '@/components/Accounts/PolkadotAccount'
import BSCAccount from '@/components/Accounts/BSCAccount'

export default {
  name: "Home",
  computed: {
    ...mapState('polkadot',["projectFundInfos", "symbol", "isConnected", 'balance', 'crowdstakings']),
    funds() {
      const fundInfos = this.getFundInfos();
      return fundInfos || [];
    },
  },
  components: {
    polkadot: PolkadotAccount,
    kusama: PolkadotAccount,
    delegate: SteemAccount,
    nominate: BSCAccount
  },
  methods: {
    ...mapGetters('polkadot',["getFundInfos", "paraIds"]),
    ...mapMutations('polkadot',[
      "saveProjectStatus",
      "saveProjectName",
      "saveCommunityName",
      'saveCrowdstakings',
      'saveCommunitys',
      'saveProjects'
    ]),
  },
  created () {

  },
};
</script>

<style lang="less" scoped>
</style>
