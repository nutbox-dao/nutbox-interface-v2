<template>
  <div class="page-view-content wallet">
    <div class="container scroll-content">
      <div class="page-view-title-v">{{ $t('game.game') }}</div>

      <div class="loading-bg" v-if="loading">
        <img src="~@/static/images/loading.gif" alt="" />
        <p class="font16">{{ $t("tip.loading") }}</p>
      </div>
      <template v-else>
        <div class="view-top-header flex-between-center">
          <div class="nav-box nav-box-bg" ref="navBox">
            <div class="nav">
              <span
                v-for="tab of tabOptions"
                :key="tab"
                :class="activeTab === tab ? 'active' : ''"
                @click="activeTab = tab"
                >{{ $t('game.' + tab) }}</span
              >
            </div>
          </div>
        </div>
        <div
          v-if="gameItems.length === 0"
          class="empty-card mb-5 d-flex flex-column justify-content-center"
        >
          <div class="empty-bg">
            <img src="~@/static/images/empty-data.png" alt="" />
            <p>{{ $t('game.noGames') }}</p>
          </div>
        </div>
        <template v-else>
          <div class="row">
            <div
              class="col-xl-4 col-md-6 mb-4"
              v-for="(game, index) in gameItems"
              :key="game.id"
            >
              <GameCard :game="game" :index="index" />
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import GameCard from "@/components/Community/Game/GameCard";
import { getAllGame } from "@/utils/web3/game";
import { mapState } from "vuex";
export default {
  name: "Game",
  components: { GameCard },
  computed: {
    ...mapState({
      games: (state) => state.web3.games,
      account: (state) => state.web3.account,
      currentCommunityId: state => state.currentCommunityId
    }),

    gameItems() {
      if (!this.games) return [];
      if (!this.activeTab) return this.games;

      return this.games.filter((t) => t.gameType == this.activeTab);
    },
  },
  data() {
    return {
      tabOptions: ["recommend", "popular", "others"],
      activeTab: 'recommend',
      loading: false,
    };
  },
  async mounted() {
    this.loading = true;
    this.url =
      this.$router.currentRoute.params.key || this.$route.query.id
        ? "/specify"
        : "";

    try {
      console.log(2344, this.currentCommunityId);
      getAllGame(this.currentCommunityId);
    } catch (e) {
      handleApiErrCode(e, (info, params) => {
        this.$bvToast.toast(info, params);
      });
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
</style>
