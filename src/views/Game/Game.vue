<template>
  <div class="page-view-content wallet">
    <div class="container scroll-content">
      <div class="page-view-title-v">Game</div>
      <div class="view-top-header flex-between-center">
        <div class="nav-box nav-box-bg" ref="navBox">
          <div class="nav">
            <span v-for="tab of tabOptions" :key="tab"
                  :class="activeTab===tab?'active':''"
                  @click="activeTab=tab">{{tab}}</span>
          </div>
        </div>
      </div>
      <div v-if="gameList.length===0"
           class="empty-card mb-5 d-flex flex-column justify-content-center">
        <div class="empty-bg">
          <img src="~@/static/images/empty-data.png" alt="" />
          <p>No Game</p>
        </div>
      </div>
      <template v-else>
        <div class="row">
          <div class="col-xl-4 col-md-6 mb-4" v-for="game of 5" :key="game">
            <GameCard/>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import GameCard from '@/components/Community/Game/GameCard'

export default {
  name: 'Game',
  components: { GameCard },
  data () {
    return {
      gameList: ['1'],
      tabOptions: ['recommend', 'popular', 'others'],
      activeTab: 'recommend'
    }
  }
}
</script>

<style scoped>

</style>
