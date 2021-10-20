<template>
  <div class="page-view-content">
    <div class="container scroll-content">
      <div class="page-view-title-v">{{$t("commen.crowdstaking") }}</div>
      <div class="loading-bg" v-if="loading">
        <img src="~@/static/images/loading.gif" alt="" />
        <p class="font16">{{ $t("tip.loading") }}</p>
      </div>
      <template v-else>
        <div class="view-top-header view-top-header-sticky p-view-top-header flex-between-center">
          <div class="nav-box nav-box-line">
            <div class="nav">
              <router-link v-if="showStakingPool" to="deposite">{{ $t('cs.deposit') }}</router-link>
              <router-link v-if="showSteemPool" to="steem-delegate">{{ $t('cs.steemDelegate') }}</router-link>
              <router-link v-if="showHivePool" to="hive-delegate">{{ $t('cs.hiveDelegate') }}</router-link>
              <router-link v-if="showNominatePool" to="nominate">{{ $t('cs.nomination') }}</router-link>
              <router-link v-if="showCrowdloanPool" to="crowdloan">{{ $t('cs.crowdloan') }}</router-link>
              <div class="center-blank"></div>
            </div>
          </div>
        </div>
        <div class="view-top-header view-top-header-sticky m-view-top-header flex-between-center">
          <b-dropdown class="top-header-dropdown" no-caret>
            <template #button-content>
              <span>{{$route.name}}</span>
              <i class="dropdown-icon ml-2"></i>
            </template>
            <b-dropdown-item v-if="showStakingPool" to="deposite">{{ $t('cs.deposit') }}</b-dropdown-item>
            <b-dropdown-item v-if="showSteemPool" to="steem-delegate">{{ $t('cs.steemDelegate') }}</b-dropdown-item>
            <b-dropdown-item v-if="showHivePool" to="hive-delegate">{{ $t('cs.hiveDelegate') }}</b-dropdown-item>
            <b-dropdown-item v-if="showNominatePool" to="nominate">{{ $t('cs.nomination') }}</b-dropdown-item>
            <b-dropdown-item v-if="showCrowdloanPool" to="crowdloan">{{ $t('cs.crowdloan') }}</b-dropdown-item>
          </b-dropdown>
        </div>
        <router-view></router-view>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapState('web3', ['communityCard']),
    ...mapGetters('web3', ['poolCards']),
    funds () {
      const fundInfos = this.getFundInfos()
      return fundInfos || []
    },
    loading () {
      return this.communityCard === null
    },
    showStakingPool () {
      return this.poolCards && this.poolCards.filter(p => p.type === 'HomeChainAssetRegistry').length > 0
    },
    showSteemPool () {
      return this.poolCards && this.poolCards.filter(p => p.type === 'SteemHiveDelegateAssetRegistry' && p.assetType === 'sp').length > 0
    },
    showHivePool () {
      return this.poolCards && this.poolCards.filter(p => p.type === 'SteemHiveDelegateAssetRegistry' && p.assetType === 'hp').length > 0
    },
    showNominatePool () {
      return this.poolCards && this.poolCards.filter(p => p.type === 'SubstrateNominateAssetRegistry').length > 0
    },
    showCrowdloanPool () {
      return this.poolCards && this.poolCards.filter(p => p.type === 'SubstrateCrowdloanAssetRegistry').length > 0
    }
  },
  methods: {
  },
  created () {
  }
}
</script>

<style lang="less" scoped>
</style>
