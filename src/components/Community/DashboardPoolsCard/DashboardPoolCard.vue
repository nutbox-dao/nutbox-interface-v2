<template>
  <div class="c-card">
    <div class="status-container text-right">
      <span v-show="!published" :class="'Completed'">{{ $t('community.unPublished') }}</span>
    </div>
    <div class="card-top mt-4">
      <div class="card-title-box flex-start-center">
        <div class="card-single-icon">
         <img class="icon1" :src="pool.asset.icon" alt="">
        </div>
        <div class="title-text font20 font-bold ml-2">
          <span>{{ pool.poolName || '--' }}</span>
        </div>
      </div>
      <div class="h-line mt-4 mb-3"></div>
      <div class="project-info-container">
        <span class="name">{{ $t('community.userCount') }}</span>
       <div class="info">{{ pool.stakerCount }}</div>
      </div>
      <div class="project-info-container">
        <span class="name">{{ $t('community.totalDeposit') }}</span>
       <div class="info">{{ totalDeposited | amountForm }}</div>
      </div>
      <!-- <div class="project-info-container">
        <span class="name">{{ $t('community.hasMined') }}</span>
        <div class="info">{{ minedToken | amountForm }}</div>
      </div> -->
      <div class="project-info-container">
        <span class="name">APY</span>
        <b-input type="number" class="apy-input" v-model="apy" step="0.01" :placeholder="$t('community.inputApy')"></b-input>
      </div>
      <button class="primary-btn" :disabled="updating" @click="confirm">
        <b-spinner small type="grow" v-show="updating" />
        {{ published ? $t('commen.update') : $t('community.publishPool')}}
      </button>
    </div>
  </div>
</template>

<script>
import { getCToken } from '@/utils/web3/asset'
import { mapState, mapGetters } from 'vuex'
import { handleApiErrCode } from '@/utils/helper'
import { updatePoolApy, getAllPools, monitorPools } from '@/utils/web3/pool'
import { sleep } from '@/utils/helper'
import { getContract } from '@/utils/web3/contract'

export default {
  name: 'DashboardPoolCard',
  computed: {
    ...mapState('web3', ['stakingFactoryId', 'blockNum', 'allPools']),
    totalDeposited() {
      return this.pool.totalStakedAmount.toString() / (10 ** this.decimal)
    }
  },
  data() {
    return {
      decimal: 1e18,
      updating: false,
      apy: null,
      minedToken: 0,
      contract: null,
      published: false
    }
  },
  watch: {
    async blockNum(newValue, oldValue) {
      try{
        if (!this.contract) return;
        const res = await this.contract.calculateReward(1, newValue)
        this.minedToken = res.toString() / 1e18
      }catch(e){
        console.log('watch total mined token failed', e);
      }
    }
  },
  props: {
    pool: {
      type: Object
    },
  },
  methods: {
    async confirm() {
      if (this.apy <= 0){
        this.$bvToast.toast(this.$t('tip.wrongApy'), {
          title: this.$t('tip.tips'),
          variant: 'info'
        })
        return;
      }
      try{
        this.updating = true
        await updatePoolApy(this.pool, parseFloat(this.apy))
        this.published = true;
        // 更新本地矿池数据
        await sleep(1)
        const aa = await getAllPools(true)
        await monitorPools()
        this.$bvToast.toast(this.$t('community.updatePoolSuccess'), {
          title: this.$t('tip.success'),
          variant: 'success'
        })
      }catch(e){
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      } finally{
        this.updating = false
      }
    }
  },
  async mounted () {
    this.apy = null
    if (this.allPools){
      const p = this.allPools.filter(pool => pool.pid === this.pool.pid && pool.communityId === this.stakingFactoryId)
      if (p.length > 0){
        this.apy = p[0].apy
        this.published = true
      }
    }
    const cToken = await getCToken(this.stakingFactoryId)
    this.decimal = cToken.decimal

    this.contract = await getContract('StakingTemplate', this.stakingFactoryId)
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
