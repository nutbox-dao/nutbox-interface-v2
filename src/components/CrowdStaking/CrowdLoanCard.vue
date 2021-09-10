<template>
  <div class="multi-card">
    <div class="card-link-top-box">
      <div class="status-container text-right">
        <span :class="status">{{ $t("cl." + status) }}</span>
      </div>
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
      <span style="color: #717376" class="font-bold">{{
        card.tokenSymbol + " "
      }}</span>
      <span style="color: #bdbfc2">EARNED</span>
    </div>
    <div class="btn-row">
      <span class="value"> {{ pendingReward | amountForm }} </span>
      <div class="right-box">
        <button :disabled="isWithdrawing" class="primary-btn m-0" @click="withdraw">
          <b-spinner small type="grow" v-show="isWithdrawing"></b-spinner>
          {{ $t("commen.withdraw") }}
        </button>
      </div>
    </div>
      <div class="detail-info-box">
        <div class="project-info-container">
          <span class="name"> {{ $t('cl.leasePeriod') }} </span>
          <div class="info">{{ leasePeriod || "Loading" }}</div>
        </div>
        <div class="project-info-container">
          <span class="name"> {{ $t('cl.countDown') }} </span>
          <div class="info">{{ countDown || "Loading" }}</div>
        </div>
        <div class="project-info-container">
          <span class="name"> {{ $t('cl.fund') }} </span>
          <div class="info">
            <RaisedLabel :fund="getFundInfo" :relaychain='chain' />
            <ContributorsLabel :fund="getFundInfo"/>
          </div>
        </div>
        <div class="project-info-container">
          <span class="name"> {{ $t('cl.contributed') }} </span>
          <div class="info">
            <RaisedLabel :fund="getFundInfo" :relaychain='chain' :isBalance="true" />
          </div>
        </div>
      </div>
      <div class="text-center">
        <button
          class="primary-btn"
          :disabled="!isConnected"
          v-show="status === 'Active'"
          @click="showContribute = true"
        >
          <b-spinner small type="grow" v-show="!isConnected"></b-spinner>
          {{ $t("cl.contribute") }}
        </button>
        <button
          class="primary-btn"
          :disabled="!isConnected"
          v-show="status === 'Retired'"
          @click="showWithdraw = true"
        >
          <b-spinner small type="grow" v-show="!isConnected"></b-spinner>
          {{ $t("cl.withdraw") }}
        </button>
        <button class="primary-btn" disabled v-show="status === 'Completed'">
          <b-spinner small type="grow" v-show="!isConnected"></b-spinner>
          {{ $t("cl.completed") }}
        </button>
      </div>
      <!-- <ConnectWallet v-else /> -->
      <b-modal
        v-model="showContribute"
        modal-class="custom-modal"
        centered
        hide-header
        hide-footer
        no-close-on-backdrop
      >
        <TipContribute
          :communityId="communityId"
          :fund="getFundInfo"
          :relaychain='chain'
          :paraName="card.poolName"
          @hideContribute="showContribute = false"
        />
      </b-modal>
      <b-modal
        v-model="showWithdraw"
        modal-class="custom-modal"
        centered
        hide-header
        hide-footer
        no-close-on-backdrop
      >
        <TipWithdraw :fund="getFundInfo" :relaychain='chain' @hideWithdraw="showWithdraw = false" />
      </b-modal>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TipContribute from '@/components/Commen/TipContribute'
import TipWithdraw from '@/components/Commen/TipWithdraw'
import ContributorsLabel from '@/components/Commen/ContributorsLabel'
import RaisedLabel from '@/components/Commen/RaisedLabel'
import { calStatus } from '@/utils/commen/crowdloan'
import { formatCountdown, handleApiErrCode } from '@/utils/helper'
import { withdrawReward } from "@/utils/web3/pool";

export default {
  data () {
    return {
      showContribute: false,
      showWithdraw: false,
      status: 'Completed',
      isWithdrawing: false
    }
  },
  props: {
    card: {
      type: Object
    }
  },
  components: {
    TipContribute,
    TipWithdraw,
    ContributorsLabel,
    RaisedLabel
  },
  methods: {
    async withdraw() {
      try{
        this.isWithdrawing = true
        await withdrawReward(this.card.communityId, this.card.pid)
      }catch(e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      }finally{
        this.isWithdrawing = false  
      }
    }
  },
  watch: {
    async currentBlockNum (newValue, _) {
      if (newValue % 20 !== 0) return;
      const fund = this.getFundInfo
      if(!fund) return;
      const end = fund.end
      const raised = fund.raised
      const cap = fund.cap
      const firstPeriod = fund.firstPeriod
      const lastPeriod = fund.lastPeriod
      const [status] = await calStatus(
        this.chain,
        end,
        firstPeriod,
        lastPeriod,
        raised,
        cap,
        this.paraId,
        newValue
      )
      this.status = status
    }
  },
  computed: {
    ...mapState(['lang']),
    ...mapState('web3', ['pendingRewards']),
    pendingReward(){
      const pendingBn = this.pendingRewards[this.card.communityId + '-' + this.card.pid]
      if(!pendingBn) return 0;
      const decimal = this.card.tokenDecimal
      return parseFloat(pendingBn.toString() / (10 ** decimal)).toFixed(3)
    },
    chain () {
      return this.card.chainId == 2 ? 'polkadot' : 'kusama'
    },
    getFundInfo () {
      return this.fundInfo(this.card.paraId)
    },
    isConnected () {
      return this.$store.state[this.chain].isConnected
    },
    clProjectFundInfos () {
      return this.$store.state[this.chain].clProjectFundInfos
    },
    fundInfo () {
      return this.$store.getters[this.chain + '/fundInfo']
    },
    currentBlockNum () {
      return this.$store.getters[this.chain + '/currentBlockNum']
    },
    cardInfo () {
      return this.$store.getters[this.chain + '/cardInfo']
    },
    paraId () {
      return parseInt(this.card.paraId)
    },
    communityId () {
      return this.card.communityAccount
    },
    leasePeriod () {
      try {
        const first = parseInt(this.getFundInfo.firstPeriod)
        const last = parseInt(this.getFundInfo.lastPeriod)
        return first === last
          ? first + ''
          : parseInt(this.getFundInfo.firstPeriod) +
          ' - ' +
          parseInt(this.getFundInfo.lastPeriod)
      } catch (e) {
        return '0'
      }
    },
    communityIcon (){
      const communityId = this.card.communityId;

    },
    countDown () {
      try {
        if (!this.getFundInfo) return
        const end = parseInt(this.getFundInfo.end)
        return formatCountdown(end, this.currentBlockNum, 6)
      } catch (e) {
        console.error('err', e)
        return 'Loading'
      }
    },
    completion () {
      try {
        return this.getFundInfo.cap.isZero()
          ? '100.00%'
          : (
            this.getFundInfo.raised
              .muln(10000)
              .div(this.getFundInfo.cap)
              .toNumber() / 100
          ).toFixed(2) + '% '
      } catch (e) {
        return '0.0%'
      }
    },
    contributions () {
      try {
        return this.getFundInfo.funds.count ?? 0
      } catch (e) {
        return 0
      }
    }
  },
  mounted () {
    this.status = this.getFundInfo?.status || this.card.statusStr
  }
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
    border-radius: 0.8rem;
  }
}
</style>
