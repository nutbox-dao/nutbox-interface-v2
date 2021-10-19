<template>
  <div class="p-card">
    <img class="poster" :src="game.gameCover" alt="" />
    <div class="second-card d-flex flex-column justify-content-between">
      <div>
        <div class="game-logo">
          <img :src="game.gameLogo" alt="" />
        </div>
        <div class="flex-between-center mt-2 mb-3">
          <div class="font20 font-bold">{{ game.gameName }}</div>
        </div>
        <div class="desc font14 text-grey-light text-left">
          {{ game.gameIntro }}
        </div>
      </div>
      <div>
        <!--   <div class="project-info-container">
          <span class="name">{{ $t('commen.apy') }}</span>
          <div class="info">-- %</div>
        </div> -->
        <button class="primary-btn" @click="gotoGame">
          {{ $t('community.join') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GameCard",
  props: ["game", "index"],
  methods: {
    gotoGame() {
      window.open(this.game.gameSite, '__blank')
    }
  },
};
</script>

<style scoped lang="scss">
@import "src/static/css/card/common-card";
@import "src/static/css/card/poster-card";
.game-logo {
  height: 3.6rem;
  width: 3.6rem;
  position: absolute;
  top: -2rem;
  left: 1.2rem;
  border: 2px solid white;
  padding: 0.2rem;
  display: flex;
  align-items: center;
  border-radius: 3.2rem 3.2rem 0 0;
  img {
    width: 100%;
  }
}
.info-icon {
  width: 1.2rem;
  height: 1.2rem;
  margin-left: 0.2rem;
  border-radius: 1.2rem;
}
.desc {
  margin-bottom: 1rem;
  @include text-multi-line(3);
}
.primary-btn {
  margin-top: 1rem;
}
</style>
