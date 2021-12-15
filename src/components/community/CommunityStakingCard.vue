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
          <div class="info">{{ card.apy ? card.apy.toFixed(2) + '%' : '--' }}</div>
        </div>
        <div class="project-info-container">
          <span class="name"> Stakers </span>
          <div class="info">{{ card.stakersCount }}</div>
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
    ...mapState('pool', ['totalStaked', 'userStaked', 'approvements', 'userReward', 'loadingApprovements']),
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
      if (!this.userStaked) return 0;
      const userStakingBn =
        this.userStaked[this.card.id]
      if (!userStakingBn) return 0
      if (this.type === CHAIN_NAME) {
        return userStakingBn.toString() / 1e18
      } else if (this.type === 'STEEM') {
        return 0
      } else if (this.type === 'HIVE') {
        return 0
      }
      return 0
    },
    tvl () {
      return 0
    },
    erc20Price () {
      return 0
    }
  },
  data () {
    return {
      isWithdrawing: false,
      homeName: CHAIN_NAME
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
    },
    openNewTab (id) {
      window.open(`${window.location.origin}/#/specify?id=${id}`, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/static/css/card/common-card";
</style>
