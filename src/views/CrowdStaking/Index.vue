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
            <router-link v-if="showStakingPool" to="/crowdstaking/deposite">{{ $t('cs.deposit') }}</router-link>
            <router-link v-if="showSteemPool" to="/crowdstaking/steem-delegate">{{ $t('cs.steemDelegate') }}</router-link>
            <router-link v-if="showHivePool" to="/crowdstaking/hive-delegate">{{ $t('cs.hiveDelegate') }}</router-link>
            <router-link v-if="showNominatePool" to="/crowdstaking/nominate">{{ $t('cs.nomination') }}</router-link>
            <router-link v-if="showCrowdloanPool" to="/crowdstaking/crowdloan">{{ $t('cs.crowdloan') }}</router-link>
            <div class="center-blank"></div>
        </div>
        <component :is='$route.name'/>
      </div>
    <router-view></router-view>
      </template>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import SteemAccount from '@/components/Accounts/SteemAccount'
import HiveAccount from '@/components/Accounts/HiveAccount'
import PolkadotAccount from '@/components/Accounts/PolkadotAccount'
import BSCAccount from '@/components/Accounts/BSCAccount'

export default {
  name: "Home",
  computed: {
    ...mapState('web3',["communityCard"]),
    ...mapGetters('web3', ['poolCards']),
    funds() {
      const fundInfos = this.getFundInfos();
      return fundInfos || [];
    },
    loading() {
      return this.communityCard === null
    },
    showStakingPool() {
      return this.poolCards && this.poolCards.filter(p => p.type === 'HomeChainAssetRegistry').length > 0
    },
    showSteemPool() {
      return this.poolCards && this.poolCards.filter(p => p.type === 'SteemHiveDelegateAssetRegistry' && p.assetType === 'sp').length > 0
    },
    showHivePool() {
      return this.poolCards && this.poolCards.filter(p => p.type === 'SteemHiveDelegateAssetRegistry' && p.assetType === 'hp').length > 0
    },
    showNominatePool() {
      return this.poolCards && this.poolCards.filter(p => p.type === 'SubstrateNominateAssetRegistry').length > 0
    },
    showCrowdloanPool () {
      return this.poolCards && this.poolCards.filter(p => p.type === 'SubstrateCrowdloanAssetRegistry').length > 0
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
