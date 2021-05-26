<template>
  <div class="k-page crowdstaking-page">
    <div class="loading-bg" v-if="!isConnected">
      <img src="~@/static/images/loading.gif" alt="" />
      <p class="font16">{{ $t('tip.loading') }}</p>
    </div>
    <template v-else>
      <div v-if="crowdstakings.length > 0"></div>
      <div class="empty-bg" v-else>
        <img src="~@/static/images/empty-data.png" alt="" />
        <p> {{ $t('tip.noProject') }} </p>
      </div>
      <div class="cards-container">
        <div class="row">
          <div class="col-xl-5 col-md-6" v-for="card, idx of crowdstakings" :key="idx">
            <CrowdStakingCard
              :crowdstaking="card"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import CrowdStakingCard from "../../components/CrowdStaking/CrowdStakingCard";
import { mapMutations, mapState, mapGetters } from "vuex";

export default {
  name: "Home",
  components: {
    CrowdStakingCard,
  },
  computed: {
    ...mapState('polkadot',["projectFundInfos", "symbol", "isConnected", 'balance', 'crowdstakings']),
    funds() {
      const fundInfos = this.getFundInfos();
      return fundInfos || [];
    },
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

<style lang="less">
.crowdstaking-page {
  height: 100%;
  background: rgba(246, 247, 249, 1);
  overflow: hidden;
  position: relative;
  .bg {
    position: absolute;
    left: 50%;
    top: 4.6rem;
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
