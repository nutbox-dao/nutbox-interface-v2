<template>
  <div class="multi-card">
    <div class="card-link-top-box">
      <div class="flex-start-center">
        <div class="card-link-icons">
          <img class="icon1" :src="card.communityIcon" alt="" />
          <img class="icon2" :src="card.icon" alt="" />
        </div>
        <div class="card-link-title-text font20 font-bold">
          <div class="link-title" @click="$router.push('/community/detail-info?id='+card.communityId)">
            <span>{{ card.communityName }}</span>
            <i class="link-icon"></i>
          </div>
          <div class="link-title">
            <span>{{ card.poolName }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="c-card">
      <div class="text-left mt-3">
        <span style="color: #717376;" class="font-bold">{{ card.tokenSymbol + ' '}}</span>
        <span style="color: #BDBFC2">EARNED</span>
      </div>
      <div class="btn-row">
        <span class="value"> 0.001 </span>
        <div class="right-box">
          <button class="primary-btn m-0">Harvest</button>
        </div>
      </div>
      <div class="text-left mt-3 mb-1">
        <span style="color: #717376;" class="font-bold">{{ card.assetType == 'sp' ? 'STEEM POWER' : 'HIVE POWER'}}</span>
        <span style="color: #BDBFC2"> STAKED</span>
      </div>
      <div class="btn-row mb-4">
        <span class="value"> 0.001 </span>
        <div class="right-box">
          <button class="outline-btn">-</button>
          <button class="outline-btn">+</button>
        </div>
      </div>
      <div class="detail-info-box">
        <div class="project-info-container">
          <span class="name"> TVL </span>
          <div class="info">{{ tvl }}</div>
        </div>
        <div class="project-info-container">
          <span class="name"> APY </span>
          <div class="info">{{ card.apy.toFixed(2) }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { vestsToSteem } from '@/utils/steem/steem'
export default {
  name: 'DDelegateCard',
  props: {
    card: {
      type: Object,
    },
  },
  watch: {
    'card.totalStakedAmount': async (val, oldVal) => {
      this.tvl = await vestsToSteem(this.card.totalStakedAmount * 1e-6)
    },
  },
  data () {
    return {
      tvl: 0
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/static/css/card/common-card";
.btn-row {
  @include c-flex-between-center;
  .value {
    font-size: 1.2rem;
    font-weight: bolder;
  }
  .right-box {
    width: 6rem;
    @include c-flex-between-center;
  }
  .outline-btn {
    background-color: white;
    border: 1px solid var(--primary-custom);
    height: 2.4rem;
    width: 2.4rem;
    border-radius: .8rem;
  }
}
</style>
