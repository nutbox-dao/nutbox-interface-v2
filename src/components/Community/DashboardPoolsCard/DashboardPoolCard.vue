<template>
  <div class="c-card">
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
       <div class="info">{{ totalDeposited }}</div>
      </div>
      <div class="project-info-container">
        <span class="name">{{ $t('community.hasMined') }}</span>
        <div class="info">10000000</div>
      </div>
      <div class="project-info-container">
        <span class="name">APY</span>
        <b-input type="number" class="apy-input" v-model="apy" step="0.01" :placeholder="$t('community.inputApy')"></b-input>
      </div>
      <button class="primary-btn" :disabled="updating" @click="confirm">
        <b-spinner small type="grow" v-show="updating" />
        {{ $t('message.confirm') }}
      </button>
    </div>
  </div>
</template>

<script>
import { getCToken } from '@/utils/web3/asset'
import { mapState } from 'vuex'
import { handleApiErrCode } from '@/utils/helper'
import { updatePoolApy } from '@/utils/web3/pool'

export default {
  name: 'DashboardPoolCard',
  computed: {
    ...mapState('web3', ['stakingFactoryId']),
    totalDeposited() {
      return this.pool.totalStakedAmount / this.decimal
    }
  },
  data() {
    return {
      decimal: 10,
      updating: false,
      apy: 0
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
      console.log(123, this.pool);
      try{
        this.updating = true
        await updatePoolApy(this.pool, parseFloat(this.apy))
        this.$bvToast.toast(this.$t('community.updatePoolSuccess'), {
          title: this.$t('tip.success'),
          variant: 'success'
        })
        // 如果有本地的矿池数据，则更新本地矿池数据
        

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
    const cToken = await getCToken(this.stakingFactoryId)
    this.decimal = cToken.decimal
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
