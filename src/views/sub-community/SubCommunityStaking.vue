<template>
  <div class="sub-staking-page h-100 position-relative">
    <div class="scroll-content position-relative">
      <div class="view-top-header d-flex my-2">
        <div class="nav-box nav-box-bg mb-3 mb-md-0">
          <div class="nav">
            <span
              v-for="(item, index) of tabOptions"
              :key="index"
              :class="activeTab === index ? 'active' : ''"
              @click="activeTab = index"
              >{{ item }}</span
            >
          </div>
        </div>
        <div class="c-btn-group">
          <button
            class="primary-btn w-auto px-2 mx-1"
            @click="activeTab = -1"
            style="height: 2rem"
          >
            Inactive Pool
          </button>
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
              <CommunityStakingCard :card="cardInfo" />
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
      tabOptions: ["All", CHAIN_NAME, "Steem", "Hive"],
    };
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
        case -1:
          return this.inActivedPools;
        case 0:
          return this.activedPools;
        case 1:
          return this.activedPools.filter(
            (p) =>
              p.poolFactory.toLowerCase() ===
              getPoolFactoryAddress("erc20staking")
          );
        case 2:
          return this.activedPools.filter(
            (p) =>
              p.poolFactory.toLowerCase() === getPoolFactoryAddress("steem") &&
              parseInt(p.chainId) == 1
          );
        case 3:
          return this.activedPools.filter(
            (p) =>
              p.poolFactory.toLowerCase() === getPoolFactoryAddress("hive") &&
              parseInt(p.chainId) == 2
          );
        case 4:
          return this.activedPools.filter(
            (p) =>
              p.poolFactory.toLowerCase() === getPoolFactoryAddress("cosmos") &&
              parseInt(p.chainId) == 3
          );
      }
    },
    activedPools() {
      if (!this.allPools || this.allPools.length === 0) return [];
      return this.allPools.filter((p) => p.status === "OPENED");
    },
    inActivedPools() {
      if (!this.allPools || this.allPools.length === 0) return [];
      return this.allPools.filter((p) => p.status === "CLOSED");
    },
  },
  async mounted() {
    while (true) {
      if (this.communityInfo && this.allPools) {
        break;
      }
      await sleep(0.3);
    }
    const updatePoolsFromGraph = rollingFunction(
      getPoolsFromGraph,
      this.allPools.map((p) => p.id),
      4
    );
    updatePoolsFromGraph.start();

    const polling = updatePoolsByPolling(this.allPools);

    this.$once("hook:beforeDestroy", () => {
      polling.stop();
      updatePoolsFromGraph.stop();
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
.view-top-header {
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
@media (max-width: 720px) {
  .view-top-header {
    flex-direction: column;
    overflow: hidden;
    .nav-box {
      width: 100%;
      overflow: auto;
    }
  }
  .c-btn {
    margin-top: 0.5rem;
    margin-right: 0;
    width: fit-content;
  }
}
@media (max-width: 560px) {
  .view-top-header {
    flex-direction: column;
    align-items: flex-end;
  }
}
</style>
