<template>
  <div class="page-view-content">
    <div class="scroll-content">
      <div class="community-detail-info">
<!--        <div class="loading-bg" >-->
<!--          <img src="~@/static/images/loading.gif" alt="" />-->
<!--          <p class="font16">{{ $t("tip.loading") }}</p>-->
<!--        </div>-->
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
                <span>矿池余额：1000.00</span>
              </div>
              <div class="desc font14 mt-2"
                   v-html="(communityInfo.description)"></div>
            </div>
          </div>
        </div>
        <div class="nav-box">
          <div class="nav mr-5">
            <span v-for="(item, index) of tabOptions" :key="index"
                  :class="activeTab===index?'active':''"
                  @click="activeTab = index">{{item.name}}</span>
          </div>
          <component :is="tabOptions[activeTab].component"></component>
        </div>
        <div class="card-container mt-4">
          <div class="row">
            <div
              class="col-xl-4 col-md-6 mb-4"
              v-for="idx of 10"
              :key="idx"
            >
              <MiningCard :chain="tabOptions[activeTab].chain"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ComCRCard from '@/components/Crowdloan/ComCRCard'
import PolkadotAccount from '@/components/Accounts/PolkadotAccount'
import SteemAccount from '@/components/Accounts/SteemAccount'
import MiningCard from '@/components/Community/MiningCard'
import { mapState } from 'vuex'
import { getMyCommunityInfo } from '@/apis/api'
export default {
  name: 'CommunityDetailInfo',
  components: {
    ComCRCard,
    PolkadotAccount,
    SteemAccount,
    MiningCard
  },
  props: {},
  data () {
    return {
      communityNominatorId: null,
      activeTab: 0,
      tabOptions: [
        { name: 'Polkadot', component: 'PolkadotAccount', chain: 'polkadot' },
        { name: 'Kusama', component: 'PolkadotAccount', chain: 'kusama' },
        { name: 'Steem', component: 'SteemAccount', chain: 'steem' }
      ],
      communityInfo: {}
    }
  },
  computed: {
    ...mapState({
    })
  },
  mounted () {
    console.log(this.communityInfo)
    this.getCommunityInfo()
  },
  methods: {
    async getCommunityInfo () {
      this.communityInfo = await getMyCommunityInfo(this.$route.query.id)
    }
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
