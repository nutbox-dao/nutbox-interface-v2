<template>
  <div class="sub-staking-page h-100 position-relative">
    <div class="scroll-content position-relative">
      <div class="view-top-header view-top-header-m0">
        <div class="mx-2">
          <div class="font24 line-height28 font-bold mb-2">{{ $t('router.farming2') }}</div>
          <div class="font16 line-height24 font-bold mb-4">{{ $t('desc.farming2') }}</div>
          <div class="nav-box nav-box-bg mb-3 mb-md-0">
            <div class="nav">
                <span v-for="(item, index) of tabOptions" :key="index"
                      :class="activeTab===index?'active':''"
                      @click="activeTab = index">{{item}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="c-loading my-5" v-if="loadingCommunityInfo"></div>
      <template v-else>
        <div v-if="stakingCards.length > 0"></div>
        <div class="empty-bg" v-else>
          <img src="~@/static/images/empty-data.png" alt="" />
          <p>{{ $t("tip.noProject") }}</p>
        </div>
        <div class="cards-container">
          <div
            class="cards-box cards-box-col3"
            :class="'col3-items-' + stakingCards.length"
          >
            <div
              class="card-item"
              v-for="cardInfo of stakingCards"
              :key="cardInfo.id"
            >
              <CommunityStakingCard :card="cardInfo" type="taxed"/>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { CHAIN_NAME } from "@/config";
import CommunityStakingCard from "@/components/community/CommunityStakingCard";
import { mapState, mapGetters } from "vuex";
import { getPoolFactoryAddress, updatePoolsByPolling } from "@/utils/web3/pool";
import { sleep, rollingFunction } from "@/utils/helper";
import { getPools as getPoolsFromGraph } from "@/utils/graphql/pool";


export default {
  name: "SubCommunityStaking",
  components: { CommunityStakingCard },
  data() {
    return {
      activeTab: 0,
      tabOptions: ['Acitive Pools', 'Inacitive Pools'],
    }
  },
  computed: {
    ...mapState("currentCommunity", [
      "communityId",
      "communityInfo",
      "loadingCommunityInfo",
      "allPools",
      "feeRatio",
      "cToken",
      "specifyDistributionEras",
      "operationHistory",
    ]),
    ...mapGetters("community", ["getCommunityInfoById"]),
    stakingCards() {
      switch (this.activeTab) {
        case 1:
          return this.inActivedPools;
        case 0:
          return this.activedPools.filter(
            (p) =>
              p.poolFactory.toLowerCase() ===
              getPoolFactoryAddress("taxederc20staking")
          );
      }
    },
    activedPools() {
      if (!this.allPools || this.allPools.length === 0) return [];
      return this.allPools.filter((p) => p.status === "OPENED");
    },
    inActivedPools() {
      if (!this.allPools || this.allPools.length === 0) return [];
      return this.allPools.filter((p) => p.status === "CLOSED" && p.poolFactory.toLowerCase() ===
              getPoolFactoryAddress("taxederc20staking"));
    },
  },
  async mounted() {
    this.tabOptions = [
      this.$t('pool.activePools'),
      this.$t('pool.inactivePools')
    ]
    while (true) {
      if (this.communityInfo && this.allPools) {
        break;
      }
      await sleep(0.3);
    }

    // const updatePoolsFromGraph = rollingFunction(
    //   getPoolsFromGraph,
    //   this.allPools.map((p) => p.id),
    //   4
    // );
    // updatePoolsFromGraph.start();

    const polling = updatePoolsByPolling(this.allPools);

    this.$once("hook:beforeDestroy", () => {
      polling.stop();
      // updatePoolsFromGraph.stop();
    });
  },
};
</script>

<style scoped lang="scss">
.sub-staking-page {
  overflow: auto;
}
.card-item {
  width: 354px;
  height: 434px;
}
</style>
