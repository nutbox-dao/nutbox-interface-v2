<template>
  <div class="page-view-content">
    <div class="community-detail-info">
      <div class="loading-bg" v-if="!communityInfo">
        <img src="~@/static/images/loading.gif" alt="" />
        <p class="font16">{{ $t("tip.loading") }}</p>
      </div>
      <template v-else>
        <div class="community-info p-card" >
          <img class="poster" :src="communityInfo.poster" alt="">
          <i class="back-icon" @click="$router.back()"></i>
          <div class="second-card">
            <img class="large-logo" :src="communityInfo.icon" alt="" />
            <div class="project-info text-left">
              <div class="d-flex align-items-center">
                <a class="font20 font-bold title icon-title official-link-icon m-0"
                   :href="communityInfo.website"
                   target="_blank">{{ communityInfo.name || 'Nutbox' }}</a>
                <i class="v-line"></i>
                <!-- <span>矿池余额：1000.00</span> -->
              </div>
              <div class="desc font14 mt-2"
                   v-html="(communityInfo.description)"></div>
            </div>
          </div>
        </div>
        <div class="nav-box container">
          <div class="nav mr-5">
            <span v-for="(item, index) of tabOptions" :key="index"
                  :class="activeTab===index?'active':''"
                  @click="activeTab = index">{{item.name}}</span>
          </div>
        </div>
        <div class="card-container mt-4">
          <component :is="tabOptions[activeTab].component"
            :crowdloanPools='crowdloanPools'
            :crowdstakingPools='crowdstakingPools'
            :delegatePools='delegatePools'
            :erc20Pools='erc20Pools'>
          </component>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import DCrowdLoan from '@/components/Community/DetailInfo/DCrowdLoan'
import DCrowdStaking from '@/components/Community/DetailInfo/DCrowdStaking'

export default {
  name: 'CommunityDetailInfo',
  components: {
    DCrowdLoan,
    DCrowdStaking
  },
  props: {},
  data () {
    return {
      communityId: null,
      activeTab: 0,
      tabOptions: [
        { name: 'Crowdloan', component: 'DCrowdLoan', chain: '' },
        { name: 'Crowdstaking', component: 'DCrowdStaking', chain: '' },
        { name: 'Delegate', component: '', chain: '' },
        { name: 'Nominate', component: '', chain: '' }
      ]
    }
  },
  computed: {
    ...mapGetters('web3', ['communityById']),
    communityInfo(){
      const com = this.communityById(this.communityId)
      console.log(245, com);
      return com
    },
    pools(){
      return this.communityInfo.pools
    },
    crowdloanPools() {
      return this.pools ? this.pools.filter(p => p.type=='SubstrateCrowdloanAssetRegistry') : []
    },
    crowdstakingPools() {
      return this.pools ? this.pools.filter(p => p.type=='SubstrateNominateAssetRegistry') : []
    },
    delegatePools(){
      return this.pools ? this.pools.filter(p => p.type=='SteemHiveDelegateAssetRegistry') : []
    },
    erc20Pools(){
      return this.pools ? this.pools.filter(p => p.type=='HomeChainAssetRegistry') : []
    }
  },
  mounted () {
    this.communityId = this.$route.query.id
    console.log(2345, this.communityId);
  },
  async created () {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import "src/static/css/card/common-card";
@import "src/static/css/card/poster-card";
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
