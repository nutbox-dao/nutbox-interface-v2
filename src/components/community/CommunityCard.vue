<template>
  <div class="p-card">
    <img class="poster" :src="cardInfo.poster" alt="">
    <img class="vip" src="~@/static/images/vip.svg" v-show="cardInfo.is_vip" alt="">
    <div class="second-card border-0 d-flex flex-column justify-content-between">
      <div>
        <img class="logo" :src="cardInfo.icon" alt="">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div class="font20 font-bold">{{ cardInfo.name }}</div>
<!--          <a :href="cardInfo.website" target="_blank" v-show="cardInfo.website">-->
<!--            <div class="more-text-icon">{{ $t('community.more') }}</div>-->
<!--          </a>-->
          <span v-if="cardInfo['isOfficial']"
                class="official-tag font12 px-1">Official</span>
        </div>
        <div class="desc font14 text-grey-light text-left">{{ cardInfo.description }}</div>
      </div>
      <!-- <div>
        <div class="project-info-container">
          <span class="name">{{ $t('asset.stakingAsset') }}</span>
          <div class="info flex-start-center">
            <span v-if="cardInfo.assetLogos.length === 0">--</span>
            <img v-else class="info-icon" :src="icon" v-for="(icon, index) in new Set(cardInfo.assetLogos)" :key="index" alt="">
          </div>
        </div>
        <div class="project-info-container">
          <span class="name">{{ $t('community.totalDepositDollor') }}</span>
          <div class="info">--</div>
        </div>
        <div class="project-info-container">
          <span class="name">{{ $t('commen.apy') }}</span>
          <div class="info">{{ apyRange }}</div>
        </div>
        <button class="primary-btn primary-btn-no-bg" disabled
                @click="openNewTab(cardInfo)">{{ $t('community.join') }}</button>
      </div> -->
      <button class="primary-btn primary-btn-no-bg"
                @click="gotoCommunity()">{{ $t('operation.enter') }}</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'CommunityCard',
  props: {
    cardInfo: Object
  },
  computed: {
    // apyRange () {
    //   let apys = this.cardInfo.apys
    //   apys = apys.filter(apy => apy > 0 && apy < 1e12)
    //   if (!apys || apys.length === 0) return '--'
    //   const max = Math.max.apply(0, apys)
    //   const min = Math.min.apply(0, apys)
    //   if (max === min) {
    //     return max.toFixed(2) + '%'
    //   } else {
    //     return min.toFixed(2) + '-' + max.toFixed(2) + '%'
    //   }
    // },
  },
  mounted () {
    console.log(23, this.cardInfo);;
  },
  methods: {
    gotoCommunity() {
      this.$store.commit('currentCommunity/saveCommunityId', this.cardInfo.id);
      this.$router.replace('/sub-community/home')
    },
  }
}
</script>

<style scoped lang="scss">
@import "src/static/css/card/common-card";
@import "src/static/css/card/poster-card";
.info-icon {
  width: 1.2rem;
  height: 1.2rem;
  margin-left: .2rem;
  border-radius: 1.2rem;
}
.vip {
  width: 1.4rem;
  height: 1.4rem;
  position: absolute;
  right: .8rem;
  top: .8rem;
}
.desc {
  margin-bottom: 1rem;
  @include text-multi-line(3)
}
.primary-btn {
  margin-top: 1rem;
}
.official-tag {
  background-color: #5087ec;
  border-radius: .4rem;
}
</style>
