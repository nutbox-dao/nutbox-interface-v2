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
        <span class="value"> {{ pendingReward }} </span>
        <div class="right-box">
          <button class="primary-btn m-0" :disabled="!approved">{{ $t('message.withdraw') }}</button>
        </div>
      </div>
      <div class="text-left mt-3 mb-1">
        <span style="color: #717376;" class="font-bold">{{ card.symbol }}</span>
        <span style="color: #BDBFC2"> STAKED</span>
      </div>
      <div class="btn-row mb-4" v-if="approved">
        <span class="value"> 0.001 </span>
        <div class="right-box">
          <button class="outline-btn" @click="decrease">-</button>
          <button class="outline-btn" @click="increase">+</button>
        </div>
      </div>
      <template v-else>
      <b-button variant="primary" @click="approve" :disabled="isApproving || loadingApprovements">
        <b-spinner
              small
              type="grow"
              v-show="isApproving || loadingApprovements"
            ></b-spinner>
        {{ $t("message.approveContract") }}
      </b-button>
    </template>
      
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

    <b-modal
      v-model="showModal"
      modal-class="custom-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <DelegateModal :operate='operate' :card='card' @hideDelegateMask="showModal=false"/>
    </b-modal>
  </div>
</template>

<script>
import { vestsToSteem } from '@/utils/steem/steem'
import DelegateModal from '@/components/ToolsComponents/SteemDelegateModal'
import { mapState } from 'vuex'
import { approvePool } from '@/utils/web3/pool'
import { handleApiErrCode } from '@/utils/helper'

export default {
  name: 'DDelegateCard',
  components: {
    DelegateModal
  },
  props: {
    card: {
      type: Object
    }
  },
  watch: {
    'card.totalStakedAmount': async (val, oldVal) => {
      this.tvl = await vestsToSteem(this.card.totalStakedAmount * 1e-6)
    }
  },
  computed: {
    ...mapState('web3', ['pendingRewards', 'approvements', 'loadingPendingRewards', 'loadingApprovements']),
    pendingReward(){
      const pendingBn = this.pendingRewards[this.card.communityId + '-' + this.card.pid]
      if(!pendingBn) return 0;
      const decimal = this.card.tokenDecimal
      return parseFloat(pendingBn.toString() / (10 ** decimal)).toFixed(3)
    },
    approved(){
      return this.approvements[this.card.communityId + '-' + this.card.pid]
    },
  },
  data () {
    return {
      tvl: 0,
      showModal: false,
      operate: 'add',
      isApproving: false,
    }
  },
  methods: {
    increase() {
      this.operate = 'add'
      this.showModal = true
    },
    decrease(){
      this.operate ='minus'
      this.showModal = true
    },
    // Approve contract
    async approve() {
      try{
        this.isApproving = true
        const hash = await approvePool(this.card)
        this.$bvToast.toast(this.$t('tip.approveSuccess'), {
          title: this.$t('tip.success'),
          variant: 'success'
        })
      }catch(e){
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      }finally{
        this.isApproving = false
      }
    }
  },
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
