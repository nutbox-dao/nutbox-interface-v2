<template>
  <div class="container scroll-content">
    <div class="view-top-header flex-between-center">
      <div class="page-title-line font20 font-bold">Game</div>
      <div class="c-btn-group">
        <button
          @click="$router.push('/community-setting/game-info?type=create')"
        >
          <i class="add-icon"></i>
          <span>Add game</span>
        </button>
      </div>
    </div>
    <div
      v-if="gameItems.length === 0"
      class="empty-card mb-5 d-flex flex-column justify-content-center"
    >
      <div class="empty-bg">
        <img src="~@/static/images/empty-data.png" alt="" />
        <p>No Game</p>
      </div>
    </div>
    <template v-else>
      <div class="row">
        <div
          class="col-xl-4 col-md-6 mb-4"
          v-for="(game, index) in gameItems"
          :key="game.id"
        >
          <SettingGameCard :game="game" :index="index" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import SettingGameCard from "@/components/Community/Game/SettingGameCard";
import { getAllGame } from "@/utils/web3/game";
import { getMyCommunityInfo } from '@/utils/web3/community'
import { mapState } from "vuex";
export default {
  name: "GameSetting",
  components: { SettingGameCard },
  computed: {
    ...mapState({
      games: (state) => state.web3.games,
      account: (state) => state.web3.account,
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
      activeTab: "",
      loading: false,
    };
  },
  async mounted() {
    this.loading = true;
    const communityInfo = await getMyCommunityInfo()

    try {
      getAllGame(communityInfo.id);
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
