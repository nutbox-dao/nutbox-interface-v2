<template>
  <div class="multi-card">
    <div class="card-link-top-box">
      <div class="d-flex align-items-center">
        <div class="card-link-icons card-link-icons-lg">
          <img class="icon1" src="https://cdn.wherein.mobi/nutbox/v2/1645831114472" alt="">
          <img class="icon2-lg" src="https://cdn.wherein.mobi/nutbox/v2/1645831114472" alt="">
        </div>
        <div class="card-link-title-text font-bold">
          <div class="link-title font20 line-height24">
            <span>Peanut</span>
          </div>
          <div class="link-title font16 line-height20">
            <span>Earn Monns & Nut</span>
          </div>
        </div>
      </div>
    </div>
    <div class="c-card text-grey-7 font14 font-bold">
      <div class="font20 line-height24 text-white">Stake Nut <br> Earn Monns</div>
      <div class="project-info-container">
        <span class="name">APR</span>
        <div class="info d-flex align-items-center">
          <i class="help-icon mr-1" v-b-popover.hover.top="'Nut50%+Moon45.113%'"></i>
          <span>95.113%</span>
        </div>
      </div>
      <div class="project-info-container">
        <span class="name">Total Staking</span>
        <div class="info">12.323.420</div>
      </div>
      <div class="project-info-container">
        <span class="name">TVL</span>
        <div class="info">$23.413</div>
      </div>
      <div class="project-info-container">
        <span class="name">Stakers</span>
        <div class="info d-flex align-items-center">
          <div :id="user.id + card.id" v-for="(user, index) of stakers" :key="user.id"
               :style="{zIndex: stakers.length-index}">
            <img class="info-icon" v-if="user.avatar && user.avatar.length > 0" :src="user.avatar" alt="">
            <img v-else class="info-icon" src="~@/static/images/avatars/default.png" alt="">
            <b-popover class="primary-bg" :target="user.id + card.id" triggers="hover focus" placement="top">
              {{ user.name ? user.name : (user.id.slice(0, 6) + '...' + user.id.slice(36, 42)) }}
            </b-popover>
          </div>
          <span class="ml-1" style="line-height: 28px">{{ card.stakersCount }}</span>
        </div>
      </div>
      <div class="project-info-container">
        <span class="name">Nut Claim Available</span>
        <div class="info">55455</div>
      </div>
<!--      <button class="primary-btn my-3 w-75" :disabled="updating" v-if="pool.status === 'OPENED'" @click="showAttention=true">-->
<!--        <b-spinner small type="grow" v-show="updating" />-->
<!--        {{ $t('pool.closePool')}}-->
<!--      </button>-->
    </div>
  </div>
</template>

<script>
export default {
  name: 'ManageNPCard',
  props: {
    gauge: {
      type: Object
    },
  },
  data () {
    return {
      card: { id: '0x3fb7e48eab43fc427360fea8547a78966495b8d4', stakersCount: 1 },
      stakers: [
        { id: '0x092146598ae9be2ca420c0f3503612ed946d1139' }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/static/css/card/common-card";
@import "src/static/css/form";
</style>
