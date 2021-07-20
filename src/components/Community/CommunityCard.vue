<template>
  <div class="p-card">
    <img class="poster" :src="cardInfo.poster" alt="">
    <div class="second-card d-flex flex-column justify-content-between">
      <div>
        <img class="logo" :src="cardInfo.icon" alt="">
        <div class="flex-between-center mb-2">
          <div class="font20 font-bold">{{cardInfo.name}}</div>
          <a :href="cardInfo.website" target="_blank">
            <div class="more-text-icon">More</div>
          </a>
        </div>
        <div class="desc font14 text-grey-light text-left">{{cardInfo.description}}</div>
      </div>
      <div>
        <div class="project-info-container">
          <span class="name">质押资产</span>
          <div class="info flex-start-center">
            --
            <!--          <img class="info-icon" src="~@/static/images/steem.svg" alt="">-->
            <!--          <img class="info-icon" src="~@/static/images/steem.svg" alt="">-->
            <!--          <img class="info-icon" src="~@/static/images/steem.svg" alt="">-->
          </div>
        </div>
        <div class="project-info-container">
          <span class="name">总质押价值</span>
          <div class="info">--</div>
        </div>
        <div class="project-info-container">
          <span class="name">年华收益率</span>
          <div class="info">--</div>
        </div>
        <button class="primary-btn"
                @click="$router.push(`/community/detail-info?id=${cardInfo.id}`)">参与</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommunityCard',
  props: {
    cardInfo: Object
  }
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
  @include text-multi-line(3);
}
.primary-btn {
  margin-top: 1rem;
}
</style>
