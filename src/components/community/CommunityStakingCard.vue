<template>
  <div class="multi-card">
    <StakingCardHeader :card="card" :status="status"/>
    <div class="c-card border-0" style="margin-top: -.5rem; background-color: var(--block-bg)">
      <div>
        <span style="color: #717376" class="font-bold mr-2">{{card.tokenSymbol}}</span>
        <span style="color: #bdbfc2">EARNED</span>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <span class="value flex-fill"> {{ pendingReward | amountForm }} </span>
        <button class="primary-btn m-0 w-auto d-flex align-items-center"
                :disabled="!approved || isWithdrawing" @click="withdraw">
          <b-spinner small type="grow" v-show="isWithdrawing"></b-spinner>
          {{ $t("commen.withdraw") }}
        </button>
      </div>
      <div class="mt-3 mb-1">
        <span style="color: #717376" class="font-bold">{{ card.symbol }}</span>
        <span style="color: #bdbfc2"> STAKED</span>
        <i class="copy-icon" @click="copy(card.address)"></i>
      </div>
      <ConnectMetaMask v-if="!metamaskConnected"/>
      <template v-else>
        <div class="d-flex justify-content-between align-items-center mb-4" v-if="approved">
          <span class="value flex-fill">
            {{ (loadingUserStakings ? 0 : staked) | amountForm }}
          </span>
          <div class="d-flex">
            <button class="symbol-btn" @click="decrease" disabled>-</button>
            <button class="symbol-btn" disabled @click="increase">+</button>
          </div>
        </div>
        <template v-else>
          <button
            class="primary-btn"
            @click="approve"
            disabled
          >
            <b-spinner
              small
              type="grow"
              v-show="isApproving || loadingApprovements"
            ></b-spinner>
            {{ $t("commen.approveContract") }}
          </button>
        </template>
      </template>
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
      </div>
    </div>

    <b-modal
      v-model="showModal"
      modal-class="custom-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <StakingHomeChainAssetModal
        :operate="operate"
        :card="card"
        @hideStakeMask="showModal = false"
      />
    </b-modal>
  </div>
</template>

<script>
import StakingHomeChainAssetModal from '@/components/common/StakingHomeChainAssetModal'
import { mapState } from 'vuex'
import { approvePool, withdrawReward } from '@/utils/web3/pool'
import { formatUserAddress, handleApiErrCode } from '@/utils/helper'
import ConnectMetaMask from '@/components/common/ConnectMetaMask'
import StakingCardHeader from '@/components/common/StakingCardHeader'
import showToastMixin from '@/mixins/copyToast'

export default {
  name: 'CommunityStakingCard',
  components: {
    StakingHomeChainAssetModal,
    ConnectMetaMask,
    StakingCardHeader
  },
  props: {
    card: {
      type: Object
    }
  },
  computed: {
    ...mapState('web3', [
      'pendingRewards',
      'approvements',
      'loadingApprovements',
      'userStakings',
      'allTokens',
      'loadingUserStakings',
      'monitorPools'
    ]),
    ...mapState(['metamaskConnected', 'prices']),
    pendingReward () {
      const pendingBn =
        this.pendingRewards[this.card.communityId + '-' + this.card.pid]
      if (!pendingBn) return 0
      const decimal = this.card.tokenDecimal
      return parseFloat(pendingBn.toString() / 10 ** decimal).toFixed(3)
    },
    approved () {
      return this.approvements[this.card.communityId + '-' + this.card.pid]
    },
    staked () {
      const userStakingBn =
        this.userStakings[this.card.communityId + '-' + this.card.pid]
      if (!userStakingBn) return 0
      const decimal = this.card.decimal
      return parseFloat(userStakingBn.toString() / 10 ** decimal)
    },
    totalDeposited () {
      if (!this.card || !this.monitorPools[this.card.communityId + '-' + this.card.pid + '-totalStakedAmount']) return 0
      const tvl = this.card && this.monitorPools[this.card.communityId + '-' + this.card.pid + '-totalStakedAmount']
      if (!tvl) return 0
      const decimal = this.card.decimal
      return (tvl.toString() / (10 ** decimal))
    },
    tvl () {
      return this.totalDeposited * this.erc20Price
    },
    erc20Price () {
      if (!this.card || !this.card.address || !this.allTokens) return null
      return this.allTokens.filter(token => token.address === this.card.address)[0].price
    },
    status () {
      const canRemove = this.monitorPools[this.card.communityId + '-' + this.card.pid + '-canRemove']
      const hasRemoved = this.monitorPools[this.card.communityId + '-' + this.card.pid + '-hasRemoved']
      const hasStopped = this.monitorPools[this.card.communityId + '-' + this.card.pid + '-hasStopped']
      if (!hasStopped) {
        return 'Active'
      } else if (!canRemove) {
        return 'Stopped'
      } else {
        if (hasRemoved) {
          return 'Removed'
        } else {
          return 'CanRemove'
        }
      }
    }
  },
  data () {
    return {
      showModal: false,
      operate: 'add',
      isApproving: false,
      isWithdrawing: false
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
    increase () {
      this.operate = 'add'
      this.showModal = true
    },
    decrease () {
      this.operate = 'minus'
      this.showModal = true
    },
    // Approve contract
    async approve () {
      try {
        this.isApproving = true
        const hash = await approvePool(this.card)
        this.$bvToast.toast(this.$t('tip.approveSuccess'), {
          title: this.$t('tip.success'),
          variant: 'success'
        })
      } catch (e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      } finally {
        this.isApproving = false
      }
    },
    async withdraw () {
      try {
        this.isWithdrawing = true
        await withdrawReward(this.card.communityId, this.card.pid)
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
