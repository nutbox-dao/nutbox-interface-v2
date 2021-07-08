<template>
  <div class="p-card">
    <img class="poster" src="~@/static/images/back-ground.png" alt="">
    <div class="second-card">
      <img class="logo" src="~@/static/images/steem.svg" alt="">
      <div class="flex-between-center mb-2">
        <div class="font20 font-bold">Peanut (PNUT）</div>
        <div class="more-text-icon">More</div>
      </div>
      <div class="desc font14 text-grey-light text-left">基于Steem区块链的去中心化质押平台</div>
      <div class="project-info-container">
        <span class="name">质押资产</span>
        <div class="info flex-start-center">
          <img class="info-icon" src="~@/static/images/steem.svg" alt="">
          <img class="info-icon" src="~@/static/images/steem.svg" alt="">
          <img class="info-icon" src="~@/static/images/steem.svg" alt="">
        </div>
      </div>
      <div class="project-info-container">
        <span class="name">总质押价值</span>
        <div class="info">$1000.00.00</div>
      </div>
      <div class="project-info-container">
        <span class="name">年华收益率</span>
        <div class="info">100-200%</div>
      </div>
      <button class="primary-btn" @click="$router.push('/community/detail-info')">参与</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommunityCard'
}
</script>

<style scoped lang="scss">
@import "src/static/css/card/common-card";
@import "src/static/css/card/poster-card";
.info-icon {
  width: .8rem;
  height: .8rem;
  margin-left: .2rem;
}
.desc {
  margin-bottom: 1rem;
}
.primary-btn {
  margin-top: 1rem;
}
</style>
