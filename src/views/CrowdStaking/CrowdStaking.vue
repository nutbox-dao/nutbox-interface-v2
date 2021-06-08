<template>
  <div class="page-view-content crowdstaking">
    <div class="page-view-title">{{$t("cs.crowdstaking") }}</div>
    <div class="nav">
      <router-link to="/crowdstaking/kusama">Kusama</router-link>
      <router-link to="/crowdstaking" exact>Polkadot</router-link>
      <div class="center-blank"></div>
    </div>
    <div class="scroll-content">
      <router-view></router-view>
    </div>
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
</style>
