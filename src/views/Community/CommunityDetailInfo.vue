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
            <img class="large-logo" :src="communityInfo.iconUrl" alt="" />
            <div class="project-info text-left">
              <div class="d-flex align-items-center">
                <a class="font20 font-bold title icon-title official-link-icon m-0"
                   :href="communityInfo.website"
                   target="_blank">{{ communityInfo.name || 'Nutbox' }}</a>
                <i class="v-line"></i>
                <span>矿池余额：1000.00</span>
              </div>
              <div class="desc font14 mt-2"
                   v-html="(communityInfo.description &&
                   (communityInfo.description[lang] ||
                   communityInfo.description['zh-CN']))"></div>
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
          <component :is="tabOptions[activeTab].component"></component>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { getMyCommunityInfo, getOnshowingCrowdloanCard as getOnshowingComCRCard } from '@/apis/api'
import { stanfiAddress } from '@/utils/commen/account'
import { loadFunds } from '@/utils/kusama/crowdloan'
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
      communityNominatorId: null,
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
    ...mapState('kusama', ['showingCrowdloan']),
    ...mapGetters('kusama', ['showingCard']),
    ...mapState(['lang']),
    crowdloanInfo () {
      const id = stanfiAddress(this.$route.query.id || '15VdT2AoEvdwjLtevCipjdYYj32kN8HZLjJtR8U3EXSQXRZL')
      if (this.showingCard && this.showingCard.length > 0) {
        return this.showingCard.filter(
          (a) => stanfiAddress(a.community.communityId) === id
        )
      }
      return []
    },
    communityInfo () {
      return this.crowdloanInfo.length > 0 && this.crowdloanInfo[0].community
    }
  },
  mounted () {
    const nominator = stanfiAddress(this.$route.params.nominatorId)
    if (nominator) {
      this.communityNominatorId = nominator
    }
  },
  async created () {
    if (this.communityInfo) return
    const res = await getOnshowingComCRCard({ relaychain: 'kusama' })
    loadFunds(res)
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
