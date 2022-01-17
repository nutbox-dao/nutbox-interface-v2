<template>
  <div class="p-card">
    <img class="poster" :src="cardInfo.poster" alt="">
    <div class="second-card border-0 d-flex flex-column justify-content-between">
      <div>
        <div class="d-flex align-items-end logo-box">
          <img class="logo" :src="cardInfo.icon || './default.png'" alt="">
          <img class="vip" style="margin-left: -1rem"
               src="~@/static/images/vip.svg" v-show="parseInt(cardInfo.isVip) === 1" alt="">
        </div>
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div class="font20 font-bold">{{ cardInfo.name }}</div>
        </div>
        <div class="desc text-left text-grey-7 font14 line-height18">
          {{ cardInfo.description }}
        </div>
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
      <button class="mx-3" :class="btnClass || 'default-btn'"
                @click="gotoCommunity()">{{ $t('operation.enter') }}</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'CommunityCard',
  props: {
    cardInfo: Object,
    btnClass: String
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
  },
  methods: {
    gotoCommunity () {
      this.$store.commit('currentCommunity/saveCommunityId', this.cardInfo.id)
      this.$router.push('/sub-community/home/?id=' + this.cardInfo.id)
    }
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
}
.desc {
  margin-bottom: 1rem;
  @include text-multi-line(3);
  height: 54px;
  font-weight: 500;
}
.primary-btn {
  margin-top: 1rem;
}
.official-tag {
  background-color: #5087ec;
  border-radius: .4rem;
}
.default-btn {
  height: 2.4rem;
  background-color: var(--block-bg);
  border: transparent;
  color: white;
  font-weight: bold;
  border-radius: .6rem;
}
.gradient-outline-btn {
  color: white;
  font-weight: bold;
  height: 2.4rem;
  border-radius: .6rem;
  border: 1px solid transparent;
  background-image: linear-gradient(to right, #3F75D5, #D27947);
  background-origin: border-box;
  box-shadow: 2px 1000px 1px var(--card-bg-primary) inset;
}
</style>
