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
      <div class="container scroll-content">
        <div class="loading-bg" v-if="loading">
          <img src="~@/static/images/loading.gif" alt="" />
          <p class="font16">{{ $t("tip.loading") }}</p>
        </div>
        <template v-else>
          <div class="view-top-header p-view-top-header flex-between-center">
            <div class="nav-box nav-box-bg">
              <div class="nav">
                <span v-for="(item, index) of tabOptions" :key="index"
                      :class="activeTab===index?'active':''"
                      @click="activeTab = index">{{item}}</span>
              </div>
            </div>
            <component :is='$route.name'/>
          </div>
          <div class="view-top-header view-top-header-sticky m-view-top-header flex-between-center">
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
            <b-dropdown class="top-header-dropdown" right no-caret>
              <template #button-content>
                <span>{{tabOptions[activeTab]}}</span>
                <i class="dropdown-icon ml-2"></i>
              </template>
              <b-dropdown-item v-for="(item, index) of tabOptions" :key="index"
                    :class="activeTab===index?'active':''"
                    @click="activeTab = index">{{item}}</b-dropdown-item>
            </b-dropdown>
          </div>
          <router-view></router-view>
        </template>
      </div>
    </div>
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
  data() {
    return {
      activeTab: 0,
      tabOptions: ['BSC', 'Ethereum', 'Tron', 'Steem']
    }
  },
  methods: {
  },
  created () {
  },
};
</script>

<style lang="scss" scoped>
</style>
