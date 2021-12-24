<template>
  <div class="multi-card">
    <StakingCardHeader :card="card"/>
    <div class="c-card border-0" style="margin-top: -.5rem; background-color: var(--block-bg)">
      <div>
        <span style="color: #717376" class="font-bold mr-2">{{ cToken ? cToken.symbol : '' }}</span>
        <span style="color: #bdbfc2">EARNED</span>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <span class="value flex-fill"> {{ pendingReward | amountForm }} </span>
        <button class="primary-btn m-0 w-auto d-flex align-items-center"
                :disabled="isWithdrawing" @click="withdraw">
          <b-spinner small type="grow" v-show="isWithdrawing"></b-spinner>
          {{ $t("operation.harvest") }}
        </button>
      </div>
      <div class="mt-3 mb-1">
        <span style="color: #717376" class="font-bold">{{ type === homeName ? stakeToken.symbol : type === 'STEEM' ? 'SP' : 'HP' }}</span>
        <span style="color: #bdbfc2"> {{ type === homeName ? 'STAKED' : 'DELEGATED'}}</span>
        <i class="copy-icon" @click="copy(cToken.address)"></i>
      </div>

      <PoolOperation :card='card'/>

      <div class="detail-info-box">
        <div class="project-info-container">
          <span class="name"> {{ $t('community.totalDeposit') }} </span>
          <div class="info">{{ totalDeposited | amountForm }}</div>
        </div>
        <div class="project-info-container">
          <span class="name"> TVL </span>
          <div class="info">{{ tvl | formatPrice }}</div>
        </div>
        <div class="project-info-container">
          <span class="name"> APR </span>
          <div class="info">{{ apr }}</div>
        </div>
        <div class="project-info-container">
          <span class="name"> Stakers </span>
          <div class="info d-flex align-items-center">
            <div :id="user.id + card.id" v-for="user of stakers" :key="user.id">
              <img class="info-icon" :src="user.avatar">
              <b-popover :target="user.id + card.id" triggers="hover focus" placement="top">
                {{ user.name ? user.name : user.id }}
              </b-popover>
            </div>
           

            <span class="ml-1">{{ card.stakersCount }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StakingHomeChainAssetModal from '@/components/common/StakingHomeChainAssetModal'
import { mapState } from 'vuex'
import { approvePool, withdrawReward, getPoolType } from '@/utils/web3/pool'
import { formatUserAddress, handleApiErrCode } from '@/utils/helper'
import StakingCardHeader from '@/components/common/StakingCardHeader'
import showToastMixin from '@/mixins/copyToast'
import { CHAIN_NAME } from '@/config'
import PoolOperation from '@/components/community/PoolOperation'
import { BLOCK_SECOND } from '@/constant'
import { getUserBaseInfo } from '@/utils/web3/account'

export default {
  name: 'CommunityStakingCard',
  components: {
    StakingHomeChainAssetModal,
    StakingCardHeader,
    PoolOperation
  },
  props: {
    card: {
      type: Object
    }
  },
  computed: {
    ...mapState('currentCommunity', ['allPools']),
    ...mapState('web3', ['allTokens']),
    ...mapState(['prices']),
    ...mapState('pool', ['totalStaked', 'userStaked', 'approvements', 'userReward', 'loadingApprovements']),
    ...mapState('steem', ['vestsToSteem']),
    ...mapState('hive', ['vestsToHive']),
    type() {
      return getPoolType(this.card.poolFactory, this.card.chainId)
    },
    ...mapState('currentCommunity', ['cToken']),
    ...mapState(['prices']),
    stakeToken() {
        if (this.type !== CHAIN_NAME || !this.allTokens) return {}
        const token = this.allTokens.filter(t => t.address.toLowerCase() == this.card.asset)[0]
        return token
    },
    pendingReward () {
      if (!this.userReward) return 0;
      const pendingBn =
        this.userReward[this.card.id]
      if (!pendingBn) return 0
      return parseFloat(pendingBn.toString() / 1e18).toFixed(3)
    },
    totalDeposited () {
      if (!this.totalStaked) return 0;
      const total =
        this.totalStaked[this.card.id]
      if (!total) return 0
      if (this.type === CHAIN_NAME) {
        return total.toString() / 1e18
      } else if (this.type === 'STEEM') {
        return total.toString() / 1e6 * this.vestsToSteem
      } else if (this.type === 'HIVE') {
        return total.toString() /1e6 * this.vestsToHive
      }
      return 0
    },
    stakePrice(){
      if(!this.prices) return 0
      let price
      if (this.type === CHAIN_NAME) {
        price = this.stakeToken.price
      } else if (this.type === "STEEM") {
        price = this.prices['STEEMETH'] * this.prices['ETHUSDT']
      } else if (this.type === "HIVE") {
        price = this.prices['HIVEUSDT']
      }
      return price ? price : 0
    },
    apr() {
      if(!this.prices || !this.cToken) return '--';
      const cTokenPrice = this.cToken.price
      const stakePrice = this.stakePrice;
      if (!cTokenPrice || cTokenPrice == 0 || stakePrice == 0) return '--';
      const blocksPerYear = 365 * 24 * 60 * 60 / BLOCK_SECOND
      const fundRatio = this.pool.community.feeRatio
      const poolRatio = this.pool.ratio
      const reward = this.rewardPerBlock * blocksPerYear * (10000 - fundRatio) * poolRatio * stakePrice;
      const stake = this.tvl;
      return parseFloat(reward / 1e6 / stake).toFixed(2) + '%';
    },
    tvl() {
      return this.totalDeposited * this.stakePrice
    },
  },
  data () {
    return {
      isWithdrawing: false,
      homeName: CHAIN_NAME,
      stakers: []
    }
  },
  mixins: [showToastMixin],
  methods: {
    formatUserAddress (address, long = true) {
      if (!address) return 'Loading Account'
      if (long) {
        if (address.length < 16) return address
        const start = address.slice(0, 28)
        const end = address.slice(-5)
        return `${start}...`
      } else {
        const start = address.slice(0, 6)
        const end = address.slice(-6)
        return `${start}...${end}`
      }
    },
    copy (address) {
      this.onCopy(this.$t('tip.copyAddress', {
        address: formatUserAddress(address)
      }), { title: this.$t('tip.clipboard') })
    },

    async withdraw () {
      try {
        this.isWithdrawing = true
        await withdrawReward(this.card.community.id, this.card.id)
        this.$bvToast.toast(this.$t('tip.withdrawSuccess'), {
          title: this.$t('tip.success'),
          variant: 'success'
        })
      } catch (e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      } finally {
        this.isWithdrawing = false
      }
    }
  },
  async mounted () {
    const len = Math.min(7, this.card.stakers.length)
    const ids = this.card.stakers.slice(0, len).map(a => a.id)
    this.stakers = await Promise.all(ids.map(id => getUserBaseInfo(id)))
  },
}
</script>

<style lang="scss" scoped>
@import "src/static/css/card/common-card";
</style>
