<template>
  <div class="c-card">
    <div class="card-top mt-4">
      <div class="card-title-box flex-start-center">
        <div class="card-single-icon">
<!--          <img class="icon1" :src="pool.asset.icon" alt="">-->
        </div>
        <div class="title-text font20 font-bold ml-2">
          <span>{{ pool.poolName || '--' }}</span>
        </div>
      </div>
      <div class="h-line mt-4 mb-3"></div>
      <div class="project-info-container">
        <span class="name">{{ $t('community.userCount') }}</span>
<!--        <div class="info">{{ pool.stakerCount }}</div>-->
      </div>
      <div class="project-info-container">
        <span class="name">{{ $t('community.totalDeposit') }}</span>
<!--        <div class="info">{{ pool.totalStakedAmount }}</div>-->
      </div>
      <div class="project-info-container">
        <span class="name">{{ $t('community.hasMined') }}</span>
        <div class="info">10000000</div>
      </div>
      <div class="project-info-container">
        <span class="name">APY</span>
        <b-input type="number" class="apy-input" step="0.01" placeholder="请输入"></b-input>
      </div>
      <button class="primary-btn" :disabled="true">Confirm</button>
    </div>
  </div>
</template>

<script>
import { getCToken } from '@/utils/web3/asset'
import { mapState } from 'vuex'

export default {
  name: 'DashboardPoolCard',
  computed: {
    ...mapState('web3', ['stakingFactoryId']),
    totalDeposited() {
      return 0//this.pool.totalDeposited / this.decimal
    }
  },
  data() {
    return {
      decimal: 10
    }
  },
  props: {
    pool: {
      type: Object
    },
  },
  async mounted () {
    const cToken = await getCToken(this.stakingFactoryId)
    // this.decimal = cToken.decimal

  },
}
</script>

<style scoped lang="scss">
@import "src/static/css/card/common-card";
.apy-input {
  width: 50%;
  border: none;
  background: #F6F7F9;
  border-radius: .8rem;
  text-align: center;
  font-size: .8rem;
  height: 2.4rem;
  &::-webkit-input-placeholder {
    color: #BDBFC2;
  }

}
</style>
