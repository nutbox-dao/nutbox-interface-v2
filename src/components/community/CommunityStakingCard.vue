<template>
  <div class="multi-card">
    <StakingCardHeader :card="card"/>
    <div class="c-card border-0">
      <div class="d-flex align-items-center">
        <span class="font-bold text-grey-47 mr-2 font14">{{ cToken ? cToken.symbol : '' }}</span>
        <div class="d-flex align-items-center">
          <span class="font14 text-grey-7">EARNED</span>
          <i class="copy-icon copy-icon-gray mx-1" @click="copy(cToken ? cToken.address : '')"></i>
          <i class="link-icon link-icon-gray" @click="gotoToken(cToken ? cToken.address : '')"></i>
        </div>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <span class="value flex-fill font-bold font24 line-height24"> {{ pendingReward | amountForm }} </span>
        <button class="primary-btn m-0 w-auto d-flex align-items-center"
                :disabled="isWithdrawing || parseFloat(pendingReward) === 0" @click="withdraw">
          <b-spinner small type="grow" v-show="isWithdrawing"></b-spinner>
          {{ $t("operation.harvest") }}
        </button>
      </div>
      <div class="mt-1 mb-1 d-flex align-items-center">
        <span class="text-grey-47 font-bold mr-2 font14">{{ type === 'erc20staking' ? stakeToken.symbol : type === 'steem' ? 'SP' : 'HP' }}</span>
        <div class="d-flex align-items-center">
          <span class="font14 text-grey-7"> {{ type === 'erc20staking' ? 'STAKED' : 'DELEGATED'}}</span>
          <template v-if="type === 'erc20staking'">
          <i class="copy-icon copy-icon-gray mx-1" @click="copy(stakeToken.address)"></i>
          <i class="link-icon link-icon-gray" @click="gotoToken(stakeToken.address)"></i>
          </template>
        </div>
      </div>

      <PoolOperation :card='card'/>

      <div class="detail-info-box text-grey-7 font14 font-bold">
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
            <div :id="user.id + card.id" v-for="(user, index) of stakers" :key="user.id"
                 :style="{zIndex: stakers.length-index}">
              <img class="info-icon" v-if="user.avatar && user.avatar.length > 0" :src="user.avatar">
              <img v-else class="info-icon" src="~@/static/images/avatars/default.png" alt="">
              <b-popover :target="user.id + card.id" triggers="hover focus" placement="top">
                {{ user.name ? user.name : (user.id.slice(0, 6) + '...' + user.id.slice(36, 42)) }}
              </b-popover>
            </div>
            <span class="ml-1" style="line-height: 28px">{{ card.stakersCount }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- showAttention tip: when the balance of community cant cover the amount -->
    <b-modal
      v-model="showAttention"
      modal-class="custom-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <div class="custom-form">
        <h3 style="color: red;text-align:center">{{ $t("tip.tips") }}</h3>
        <div class="my-3 font20 line-height24 text-center">
          {{ $t("community.insufficientBalance") }}
        </div>
        <div class="mb-4 font20 line-height24 text-center">
          {{ `Please contact community manager to recharge balance.` }}
        </div>

        <div class="d-flex justify-content-between" style="gap: 2rem">
          <button
            class="primary-btn"
            @click="showAttention = false"
          >
            {{ $t("operation.cancel") }}
          </button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import StakingHomeChainAssetModal from '@/components/common/StakingHomeChainAssetModal'
import { mapState, mapGetters } from 'vuex'
import { withdrawReward, getPoolType } from '@/utils/web3/pool'
import { formatUserAddress, handleApiErrCode } from '@/utils/helper'
import StakingCardHeader from '@/components/common/StakingCardHeader'
import showToastMixin from '@/mixins/copyToast'
import { BLOCK_CHAIN_BROWER } from '@/config'
import PoolOperation from '@/components/community/PoolOperation'
import { BLOCK_SECOND } from '@/constant'
import { getUserBaseInfo } from '@/utils/web3/account'
import { getCommunityRewardPerBlock } from '@/utils/web3/community'

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
    ...mapState('currentCommunity', ['allPools', 'cToken', 'communityBalance']),
    ...mapState('web3', ['allTokens']),
    ...mapState(['prices']),
    ...mapState('pool', ['totalStaked', 'userStaked', 'approvements', 'userReward', 'loadingApprovements']),
    ...mapState('steem', ['vestsToSteem']),
    ...mapState('hive', ['vestsToHive']),
    ...mapGetters('web3', ['tokenDecimals', 'tokenByKey']),
    type() {
      return getPoolType(this.card.poolFactory, this.card.chainId)
    },
    ...mapState('currentCommunity', ['cToken']),
    ...mapState(['prices']),
    stakeToken() {
        if (this.type !== 'erc20staking' || !this.allTokens) return {}
        const token = this.tokenByKey(this.card.asset)
        return token
    },
    pendingReward () {
      if (!this.userReward) return 0;
      const pendingBn =
        this.userReward[this.card.id]
      if (!pendingBn) return 0
      return parseFloat(pendingBn.toString() / (10 ** this.cToken.decimal)).toFixed(3)
    },
    totalDeposited () {
      if (!this.totalStaked) return 0;
      const total =
        this.totalStaked[this.card.id]
      if (!total) return 0
      if (this.type === 'erc20staking') {
        return total.toString() / (10 ** this.stakeToken.decimal)
      } else if (this.type === 'steem') {
        return total.toString() / 1e6 * this.vestsToSteem
      } else if (this.type === 'hive') {
        return total.toString() /1e6 * this.vestsToHive
      }
      return 0
    },
    stakePrice(){
      if(!this.prices) return 0
      let price
      if (this.type === 'erc20staking') {
        price = this.stakeToken.price
      } else if (this.type === "steem") {
        price = this.prices['steem']
      } else if (this.type === "hive") {
        price = this.prices['hive']
      }
      return price ? parseFloat(price) : 0
    },
    apr() {
      if(!this.prices || !this.cToken || !this.tvl) return '--';
      const cTokenPrice = this.cToken.price
      const stakePrice = this.stakePrice;
      if (!cTokenPrice || cTokenPrice == 0 || stakePrice == 0) return '--';
      const blocksPerYear = 365 * 24 * 60 * 60 / BLOCK_SECOND
      const fundRatio = this.card.community.feeRatio
      const poolRatio = this.card.ratio
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
      stakers: [],
      rewardPerBlock: 0,
      showAttention: false
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
      }), { title: this.$t('tip.clipboard') }, address)
    },
    gotoToken(address) {
      window.open(BLOCK_CHAIN_BROWER + 'token/' + address, '_blank')
    },
    async withdraw () {
      try {
        if (!this.cToken.isMintable) {
          if (this.userReward[this.card.id] > this.communityBalance) {
            this.showAttention = true;
            return;
          }
        }
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
    getCommunityRewardPerBlock(this.card.community.id).then(res => {
      this.rewardPerBlock = res
    }).catch(e => {
      console.log('Get community reward fail', e);
    });
  },
}
</script>

<style lang="scss" scoped>
@import "src/static/css/card/common-card";
.c-card {
  padding: 22px 20px;
  margin-top: -24px;
  height: 330px;
  min-height: 330px;
}
</style>
