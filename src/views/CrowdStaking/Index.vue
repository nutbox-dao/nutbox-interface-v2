<template>
  <div class="page-container">
    <div class="page-view-sidebar">
      <b-nav vertical>
        <b-nav-item v-if="showStakingPool" to="/crowdstaking/deposite">{{ $t('cs.deposit') }}</b-nav-item>
        <b-nav-item v-if="showSteemPool" to="/crowdstaking/steem-delegate">{{ $t('cs.steemDelegate') }}</b-nav-item>
        <b-nav-item v-if="showHivePool" to="/crowdstaking/hive-delegate">{{ $t('cs.hiveDelegate') }}</b-nav-item>
        <b-nav-item v-if="showNominatePool" to="/crowdstaking/nominate">{{ $t('cs.nomination') }}</b-nav-item>
        <b-nav-item v-if="showCrowdloanPool" to="/crowdstaking/crowdloan">{{ $t('cs.crowdloan') }}</b-nav-item>
      </b-nav>
    </div>
    <div class="side-page-view-content">
      <div class="loading-bg" v-if="loading">
        <img src="~@/static/images/loading.gif" alt="" />
        <p class="font16">{{ $t("tip.loading") }}</p>
      </div>
      <template >
        <div class="view-top-header view-top-header-sticky m-view-top-header">
          <div class="container text-left">
            <b-dropdown class="top-header-dropdown" no-caret>
              <template #button-content>
                <span>{{$route.name}}</span>
                <i class="dropdown-icon ml-2"></i>
              </template>
              <b-dropdown-item to="/crowdstaking/deposite">{{ $t('cs.deposit') }}</b-dropdown-item>
              <b-dropdown-item to="/crowdstaking/steem-delegate">{{ $t('cs.steemDelegate') }}</b-dropdown-item>
              <b-dropdown-item to="/crowdstaking/hive-delegate">{{ $t('cs.hiveDelegate') }}</b-dropdown-item>
              <b-dropdown-item to="/crowdstaking/nominate">{{ $t('cs.nomination') }}</b-dropdown-item>
              <b-dropdown-item to="/crowdstaking/crowdloan">{{ $t('cs.crowdloan') }}</b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
        <div class="container scroll-content">
          <router-view></router-view>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

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
  methods: {
  },
  created () {
  },
};
</script>

<style lang="scss" scoped>
.m-view-top-header {
  border-bottom: 1px solid var(--dividers);
  background-color: white;
}
</style>
