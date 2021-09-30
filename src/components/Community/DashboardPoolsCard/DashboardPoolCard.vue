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
      <div class="project-info-container">
        <span class="name">{{ $t('community.totalDepositDollor') }}</span>
       <div class="info">{{ tvl | formatPrice }}</div>
      </div>
      <!-- <div class="project-info-container">
        <span class="name">{{ $t('community.hasMined') }}</span>
        <div class="info">{{ minedToken | amountForm }}</div>
      </div> -->
      <button class="primary-btn" :disabled="updating" v-if='!published' @click="confirm">
        <b-spinner small type="grow" v-show="updating" />
        {{ $t('community.publishPool')}}
      </button>
    </div>
  </div>
</template>

<script>
import { getCToken } from '@/utils/web3/asset'
import { mapState, mapGetters } from 'vuex'
import { handleApiErrCode } from '@/utils/helper'
import { publishPool, getAllPools, monitorPools } from '@/utils/web3/pool'
import { sleep } from '@/utils/helper'
import { getContract } from '@/utils/web3/contract'

export default {
  name: 'DashboardPoolCard',
  computed: {
    ...mapState('web3', ['stakingFactoryId', 'blockNum', 'allPools', 'allTokens']),
    ...mapState({
      steemVests: state => state.steem.vestsToSteem,
      hiveVests: state => state.hive.vestsToHive,
      prices: state => state.prices
    }),
    totalDeposited() {
      console.log(this.pool, this.decimals, this.steemVests)
      return this.pool && this.pool.totalStakedAmount.toString() / this.decimals
    },
    tvl () {
      if (!this.pool) return '--'
      switch (this.pool.asset.type) {
        case 'SteemHiveDelegateAssetRegistry':
          {
            if (this.pool.asset.chainId === 1){ // steem
              return this.totalDeposited * this.prices['STEEMETH']
            }else if (this.pool.asset.chainId === 2) { // hive
              return this.totalDeposited * this.prices['HIVEETH']
            }
          }
        case 'SubstrateCrowdloanAssetRegistry' || 'SubstrateNominateAssetRegistry':
          {
            if (this.pool.asset.chainId === 2) { // polkadot
              return this.totalDeposited * this.prices['DOTUSDT'] / this.prices['ETHUSDT']
            }else if (this.pool.asset.chainId === 3) { // kusama
              return this.totalDeposited * this.price['KSMUSDT'] / this.prices['ETHUSDT']
            }
          }
        case 'HomeChainAssetRegistry':
          return this.erc20Price
      }
    },
    decimals() {
      if (!this.pool) return 1e18
      switch (this.pool.asset.type) {
        case 'SteemHiveDelegateAssetRegistry':
          {
            if (this.pool.asset.chainId === 1){ // steem
              return 1e6 / this.steemVests
            }else if (this.pool.asset.chainId === 2) { // hive
              return 1e6 / this.hiveVests
            }
          }
        case 'SubstrateCrowdloanAssetRegistry' || 'SubstrateNominateAssetRegistry':
          {
            if (this.pool.asset.chainId === 2) { // polkadot
              return 1e10
            }else if (this.pool.asset.chainId === 3) { // kusama
              return 1e12
            }
          }
        default:
          return 1e18
      }
    },
    erc20Price(){
      if (!this.pool || this.pool.asset.type !== 'HomeChainAssetRegistry' || !this.publishePoolInfo) return null;
      return this.allTokens[this.publishePoolInfo.address]
    }
  },
  data() {
    return {
      updating: false,
      minedToken: 0,
      contract: null,
      published: false,
      publishePoolInfo: null
    }
  },
  props: {
    pool: {
      type: Object
    },
  },
  methods: {
    async confirm() {
      try{
        this.updating = true
        await publishPool(this.pool)
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
    if (this.allPools){
      const p = this.allPools.filter(pool => pool.pid === this.pool.pid && pool.communityId === this.stakingFactoryId)
      
      if (p.length > 0){
        this.publishePoolInfo = p[0]
        this.published = true
      }
    }
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
