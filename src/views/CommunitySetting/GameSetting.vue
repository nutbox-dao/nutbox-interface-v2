<template>
  <div class="container scroll-content">
    <div class="view-top-header flex-between-center">
      <div class="page-title-line font20 font-bold">Game</div>
      <div class="c-btn-group" >
        <button @click="$router.push('/community-setting/game-info?type=create')">
          <i class="add-icon"></i>
          <span>Add game</span>
        </button>
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
          <SettingGameCard/>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import SettingGameCard from '@/components/Community/Game/SettingGameCard'

export default {
  name: 'GameSetting',
  components: { SettingGameCard },
  data () {
    return {
      gameList: ['1']
    }
  }
}
</script>

<style scoped>

</style>
