<template>
  <div class="p-card">
    <img class="poster" :src="cardInfo.poster" alt="">
    <div class="second-card d-flex flex-column justify-content-between">
      <div>
        <img class="logo" :src="cardInfo.icon" alt="">
        <div class="flex-between-center mb-2">
          <div class="font20 font-bold">{{ cardInfo.name }}</div>
          <a :href="cardInfo.website" target="_blank" v-show="cardInfo.website">
            <div class="more-text-icon">{{ $t('community.more') }}</div>
          </a>
        </div>
        <div class="desc font14 text-grey-light text-left">{{ cardInfo.description }}</div>
      </div>
      <div>
        <div class="project-info-container">
          <span class="name">{{ $t('asset.stakingAsset') }}</span>
          <div class="info flex-start-center">
            <span v-if="cardInfo.assetLogos.length === 0">--</span>
            <img v-else class="info-icon" :src="icon" v-for="(icon, index) in new Set(cardInfo.assetLogos)" :key="index" alt="">
          </div>
        </div>
        <!-- <div class="project-info-container">
          <span class="name">{{ $t('community.totalDepositDollor') }}</span>
          <div class="info">--</div>
        </div> -->
        <div class="project-info-container">
          <span class="name">{{ $t('commen.apy') }}</span>
          <div class="info">{{ apyRange }}</div>
        </div>
        <button class="primary-btn"
                @click="openNewTab(cardInfo)">{{ $t('community.join') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommunityCard',
  props: {
    cardInfo: Object
  },
  computed: {
    apyRange() {
      let apys = this.cardInfo.apys;
      apys = apys.filter(apy => apy > 0 && apy < 1e12)
      if (!apys || apys.length === 0) return '--'
      const max = Math.max.apply(0, apys)
      const min = Math.min.apply(0, apys)
      if (max === min){
        return max.toFixed(2) + '%'
      }else{
        return min.toFixed(2) + '-' + max.toFixed(2) + '%'
      }
    }
  },
  methods: {
    openNewTab (cardInfo) {
      window.open(`${window.location.origin}/#/specify?id=${cardInfo.id}`, '_blank')
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
.desc {
  margin-bottom: 1rem;
  @include text-multi-line(3)
}
.primary-btn {
  margin-top: 1rem;
}
</style>
