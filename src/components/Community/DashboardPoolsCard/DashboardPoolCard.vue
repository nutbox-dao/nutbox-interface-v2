<template>
  <div class="c-card">
    <div class="status-container text-right">
      <span v-if="status === 'Active'" :class="'Active'">{{ $t('community.'+status) }}</span>
      <span v-else class="Completed">{{ $t('community.'+status) }}</span>
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
       <div class="info">{{ stakerCount }}</div>
      </div>
      <div class="project-info-container">
        <span class="name">{{ $t('community.totalDeposit') }}</span>
       <div class="info">{{ totalDeposited | amountForm }}</div>
      </div>
      <div class="project-info-container">
        <span class="name">{{ $t('community.totalDepositDollor') }}</span>
       <div class="info">{{ tvl | formatPrice }}</div>
      </div>
      <div class="project-info-container">
        <span class="name">{{ $t('stake.staked') + (stakedERC20 ? stakedERC20.symbol : 'NUT') }}</span>
       <div class="info">{{ ((pool.stakedNUT ? pool.stakedNUT.toString() : 0) / 1e18) | amountForm }}</div>
      </div>
      <!-- <div class="project-info-container">
        <span class="name">{{ $t('community.hasMined') }}</span>
        <div class="info">{{ minedToken | amountForm }}</div>
      </div> -->
      <button class="primary-btn" :disabled="updating" v-if='!published' @click="confirm">
        <b-spinner small type="grow" v-show="updating" />
        {{ $t('community.publishPool')}}
      </button>
      <template v-else>
        <button class="primary-btn" :disabled="updating" v-if="status === 'Active'" @click="stop">
          <b-spinner small type="grow" v-show="updating" />
          {{ $t('community.stopPool')}}
        </button>
        <button class="primary-btn" :disabled="updating" v-else-if="status === 'CanRemove'" @click="remove">
          <b-spinner small type="grow" v-show="updating" />
          {{ $t('community.removePool')}}
        </button>
        <button class="primary-btn" :disabled="updating" v-else-if="status === 'Stopped'" @click="withdraw">
          <b-spinner small type="grow" v-show="updating" />
          {{ $t('community.withdrawPool')}}
        </button>
        <button class="primary-btn" :disabled="true" v-else-if="status === 'Removed'" @click="withdraw">
          <b-spinner small type="grow" v-show="updating" />
          {{ $t('community.Removed')}}
        </button>
      </template>
      
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { handleApiErrCode, sleep } from '@/utils/helper'
import { publishPool, getAllPools, getMyOpenedPools, monitorPools, stopPool, tryWithdraw, removePool } from '@/utils/web3/pool'
import { getAssetMetadata } from '@/utils/web3/asset'

export default {
  name: 'DashboardPoolCard',
  computed: {
    ...mapState('web3', ['stakingFactoryId', 'blockNum', 'allPools', 'allTokens', 'monitorPools']),
    ...mapState({
      steemVests: state => state.steem.vestsToSteem,
      hiveVests: state => state.hive.vestsToHive,
      prices: state => state.prices
    }),
    totalDeposited() {
      if (!this.pool || !this.monitorPools[this.stakingFactoryId + '-' + this.pool.pid + '-totalStakedAmount']) return 0;
      return this.pool && this.monitorPools[this.stakingFactoryId + '-' + this.pool.pid + '-totalStakedAmount'] / this.decimals
    },
    tvl () {
      if (!this.pool) return '--'
      switch (this.pool.asset.type) {
        case 'SteemHiveDelegateAssetRegistry':
          {
            if (this.pool.asset.chainId === 1){ // steem
              return this.totalDeposited * this.prices['STEEMETH']
            }else if (this.pool.asset.chainId === 2) { // hive
              return this.totalDeposited * this.prices['HIVEUSDT'] / this.prices['ETHUSDT']
            }
          }
        case 'SubstrateCrowdloanAssetRegistry' || 'SubstrateNominateAssetRegistry':
          {
            if (this.pool.asset.chainId === 2) { // polkadot
              return this.totalDeposited * this.prices['DOTUSDT'] / this.prices['ETHUSDT']
            }else if (this.pool.asset.chainId === 3) { // kusama
              return this.totalDeposited * this.prices['KSMUSDT'] / this.prices['ETHUSDT']
            }
          }
        case 'HomeChainAssetRegistry':
          return this.erc20Price * this.totalDeposited * this.prices['ETHUSDT']
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
      if (!this.pool || this.pool.asset.type !== 'HomeChainAssetRegistry') return null;
      return this.allTokens.filter(({address}) => address === this.pool.asset.address)[0]?.price
    },
    stakerCount() {
      return this.monitorPools[this.stakingFactoryId + '-' + this.pool.pid + '-stakerCount']
    },
    status (){
      if (!this.pool) return 'loading'
      if (this.published){
        const canRemove = this.monitorPools[this.stakingFactoryId + '-' + this.pool.pid + '-canRemove']
        const hasRemoved = this.monitorPools[this.stakingFactoryId + '-' + this.pool.pid + '-hasRemoved']
        const hasStopped = this.monitorPools[this.stakingFactoryId + '-' + this.pool.pid + '-hasStopped']
        if(!hasStopped){
          return 'Active'
        }else if (!canRemove){
          return 'Stopped'
        }else{
          if (hasRemoved){
            return 'Removed'
          }else{
            return 'CanRemove'
          }
        }
      }else{
        return 'unPublished'
      }
    }
  },
  data() {
    return {
      updating: false,
      minedToken: 0,
      contract: null,
      published: false,
      stakedERC20: {}
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
        await sleep(2)
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
    },
    async stop() {
      try{
        if (this.pool.poolRatio !== 0 && this.pool.poolRatio !== 10000) {
          this.$bvToast.toast(this.$t('tip.stopPoolTips'), {
            title: this.$t('tip.tips'),
            variant: 'info'
          })
          return;
        }
        this.updating = true
        const res = await stopPool(this.pool.pid)
        await getMyOpenedPools(true)
        this.$bvToast.toast(this.$t('tip.stopPoolOk'), {
          title: this.$t('tip.tips'),
          variant:'success'
        })
      }catch(e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      } finally{
        this.updating = false
      }
    },
    async withdraw() {
      try{
        this.updating = true
        const res = await tryWithdraw(this.pool.pid)
        await getMyOpenedPools(true)
        this.$bvToast.toast(this.$t('tip.tryWithdrawOk'), {
          title: this.$t('tip.tips'),
          variant:'success'
        })
      }catch(e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      } finally{
        this.updating = false
      }
    },
    async remove() {
      try{
        this.updating = true
        const res = await removePool(this.pool.pid)
        await getMyOpenedPools(true)
        this.pool.stakedNUT = 0
        this.$bvToast.toast(this.$t('tip.removePoolOk'), {
          title: this.$t('tip.tips'),
          variant:'success'
        })
      }catch(e) {
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
        this.published = true
      }
    }
    this.stakedERC20 = await getAssetMetadata(this.pool.NUT, 'HomeChainAssetRegistry')
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
