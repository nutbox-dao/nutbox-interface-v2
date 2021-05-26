<template>
  <div class="k-page crowdloan-page">
    <div class="loading-bg" v-if="loadingFunds">
      <img src="~@/static/images/loading.gif" alt="" />
      <p class="font16">{{ $t('tip.loading') }}</p>
    </div>
    <template v-else>
      <div v-if="funds.length > 0"></div>
      <div class="empty-bg" v-else>
        <img src="~@/static/images/empty-data.png" alt="" />
        <p> {{ $t('tip.noAuction') }} </p>
      </div>
      <div class="cards-container">
          <div class="row">
            <div class="col-xl-5 col-md-6" v-for="card, idx of showingCard()" :key="idx">
                <CrowdloanCard
                  :paraId="parseInt(card.para.paraId)"
                  :communityId="card.community.communityId"
                />
            </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import CrowdloanCard from "../../components/Crowdloan/CrowdloanCard";
import {
  subscribeFundInfo as subscribeKusamaFundInfo
} from "../../utils/kusama/crowdloan";
import { mapState, mapGetters } from "vuex";
import { getOnshowingCrowdloanCard } from "../../apis/api"

export default {
  name: "Kusama",
  components: {
    CrowdloanCard,
  },
  computed: {
    ...mapState('kusama', ["clProjectFundInfos", "loadingFunds"]),
    funds() {
      const fundInfos = this.clProjectFundInfos;
      return fundInfos || [];
    },
  },
  methods: {
    ...mapGetters('kusama', ['showingCard']),
  },
  async created() {
    const res = await getOnshowingCrowdloanCard({relaychain:"rococo"})
    await subscribeKusamaFundInfo(res);
  },
};
</script>

<style lang="less" scoped>
.crowdloan-page {
  height: 100%;
  background: rgba(246, 247, 249, 1);
  overflow: hidden;
  position: relative;
  .bg {
    position: absolute;
    left: 50%;
    top: 4.8rem;
    transform: translateX(-50%);
    margin: auto;
    max-width: 34rem;
    max-height: 34rem;
    width: 90vw;
    height: 90vw;
    background-image: linear-gradient(
      to bottom,
      rgba(255, 219, 27, 0.7),
      rgba(141, 231, 255, 0)
    );
    background-repeat: repeat-x;
    border-radius: 34rem;
    background-position: center top;
  }
  .loading-bg {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    img {
      margin-top: 12rem;
    }
    p {
      margin-top: 1rem;
      font-weight: 400;
      color: #bdbfc2;
      line-height: 22px;
    }
  }
  .cards-container {
    height: 100%;
    overflow: auto;
    padding-top: 3.6rem;
    padding-bottom: 3rem;
  }
}
</style>
