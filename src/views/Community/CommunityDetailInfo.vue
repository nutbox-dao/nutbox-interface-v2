<template>
  <div class="page-view-content">
    <div class="container scroll-content">
      <div class="page-view-title-v">{{$t("commen.crowdstaking") }}</div>
      <div class="community-detail-info mb-5">
        <div class="loading-bg" v-if="!communityInfo || !pools">
          <img src="~@/static/images/loading.gif" alt="" />
          <p class="font16">{{ $t("tip.loading") }}</p>
        </div>
        <template v-else>
          <div class="view-top-header view-top-header-sticky p-view-top-header flex-between-center">
            <div class="nav-box nav-box-line">
              <div class="nav mr-5">
                <span v-for="(item, index) of tabOptions" :key="index"
                      v-show="showTab(index)"
                      :class="activeTab===index?'active':''"
                      @click="activeTab = index">{{item.name}}</span>
              </div>
            </div>
            <component :is='wallet'></component>
          </div>
          <div class="view-top-header view-top-header-sticky m-view-top-header flex-between-center">
            <b-dropdown class="top-header-dropdown" no-caret>
              <template #button-content>
                <span>{{tabOptions[activeTab].name}}</span>
                <i class="dropdown-icon ml-2"></i>
              </template>
              <b-dropdown-item v-for="(item, index) of tabOptions" :key="index"
                               v-show="showTab(index)"
                               :class="activeTab===index?'active':''"
                               @click="activeTab = index">{{item.name}}</b-dropdown-item>
            </b-dropdown>
            <component :is='wallet'></component>
          </div>
          <div class="card-container tab-container">
            <component :is="tabOptions[activeTab].component"
                       :crowdloanPools='crowdloanPools'
                       :nominatePools='nominatePools'
                       :steemDelegatePools='steemDelegatePools'
                       :hiveDelegatePools='hiveDelegatePools'
                       :erc20Pools='erc20Pools'>
            </component>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import DCrowdLoan from '@/components/Community/DetailInfo/DCrowdLoan'
import DCrowdStaking from '@/components/Community/DetailInfo/DCrowdStaking'
import DSteemDelegate from '@/components/Community/DetailInfo/DSteemDelegate'
import DHiveDelegate from '@/components/Community/DetailInfo/DHiveDelegate'
import DNominate from '@/components/Community/DetailInfo/DNominate'
import BSCAccount from '@/components/Accounts/BSCAccount'
import PolkadotAccount from '@/components/Accounts/PolkadotAccount'
import SteemAccount from '@/components/Accounts/SteemAccount'
import HiveAccount from '@/components/Accounts/HiveAccount'
import CommunityBlog from '@/views/Blog/CommunityBlog'
import { sleep } from '@/utils/helper'

export default {
  name: 'CommunityDetailInfo',
  components: {
    DCrowdLoan,
    DCrowdStaking,
    DSteemDelegate,
    DHiveDelegate,
    DNominate,
    BSCAccount,
    PolkadotAccount,
    SteemAccount,
    HiveAccount,
    CommunityBlog
  },
  props: {},
  data () {
    return {
      communityId: null,
      activeTab: 0
    }
  },
  computed: {
    ...mapGetters('web3', ['communityById']),
    communityInfo () {
      const com = this.communityById(this.communityId)
      return com
    },
    wallet () {
      switch (this.activeTab) {
        case 0:
          return 'BSCAccount';
        case 1:
          return 'SteemAccount'
        case 2:
          return 'HiveAccount';
        case 3:
          return 'PolkadotAccount';
        case 4:
          return 'PolkadotAccount';
        default:
          break;
      }
    },
    pools () {
      return this.communityInfo.pools
    },
    crowdloanPools () {
      return this.pools ? this.pools.filter(p => p.type == 'SubstrateCrowdloanAssetRegistry') : []
    },
    nominatePools () {
      return this.pools ? this.pools.filter(p => p.type == 'SubstrateNominateAssetRegistry') : []
    },
    steemDelegatePools () {
      return this.pools ? this.pools.filter(p => p.type == 'SteemHiveDelegateAssetRegistry' && p.assetType == 'sp') : []
    },
    hiveDelegatePools () {
      return this.pools ? this.pools.filter(p => p.type == 'SteemHiveDelegateAssetRegistry' && p.assetType == 'hp') : []
    },
    erc20Pools () {
      return this.pools ? this.pools.filter(p => p.type == 'HomeChainAssetRegistry') : []
    },
    tabOptions () {
      return [
        { name: this.$t('cs.deposit'), component: 'DCrowdStaking', chain: '' },
        { name: this.$t('cs.steemDelegate'), component: 'DSteemDelegate', chain: '' },
        { name: this.$t('cs.hiveDelegate'), component: 'DHiveDelegate', chain: '' },
        { name: this.$t('cs.nomination'), component: 'DNominate', chain: '' },
        { name: this.$t('cs.crowdloan'), component: 'DCrowdLoan', chain: '' }
      ]
    }
  },
  watch: {
    pools(newValue, oldValue) {
      if (!oldValue){

      }
    }
  },
  async mounted () {
    this.communityId = this.$route.query.id
    let count  = 0
    while(!this.pools){
      await sleep(1)
      if(count++ > 15) break;
    }
    if (this.showTab(0)){
      this.activeTab = 0
    } else if (this.showTab(1)){
      this.activeTab = 1
    } else if (this.showTab(2)) {
      this.activeTab = 2
    } else if (this.showTab(3)) {
      this.activeTab = 3
    } else if(this.showTab(4)) {
      this.activeTab = 4
    }
  },
  methods: {
    showTab (index) {
      switch(index) {
        case 0:
          return this.erc20Pools.length > 0
        case 1:
          return this.steemDelegatePools.length > 0
        case 2:
          return this.hiveDelegatePools.length > 0
        case 3:
          return this.nominatePools.length > 0
        case 4:
          return this.crowdloanPools.length > 0
        case 5:
          return this.communityInfo.blogTag && this.communityInfo.blogTag.length > 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/static/css/card/common-card";
@import "src/static/css/card/poster-card";
.community-detail-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  .tab-container {
    flex: 1;
    position: relative;
  }
}
.p-card {
  .poster{
    @include card-poster-bg(12rem);
    background-color: var(--primary-custom);
  }
  .back-icon {
    @include icon(1.8rem , 1.8rem);
    background-image: url("~@/static/images/left-arrow.png");
    position: absolute;
    left: 1.2rem;
    top: 1.2rem;
  }
  .v-line {
    display: inline-block;
    margin: 0 1rem;
    @include line(1px, 1rem, 0, #E3E5E8)
  }
}
</style>
