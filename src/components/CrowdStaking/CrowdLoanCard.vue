<template>
  <div class="multi-card">
    <StakingCardHeader :card="card" :status="poolStatus === 'Active' ? status : poolStatus" />
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
          <button disabled class="primary-btn m-0" @click="withdraw">
            <b-spinner small type="grow" v-show="isWithdrawing"></b-spinner>
            {{ $t("commen.withdraw") }}
          </button>
        </div>
      </div>
      <div class="text-left mt-3">
        <span style="color: #717376" class="font-bold">{{ card.chainId == 2 ? 'DOT ' : 'KSM ' }}</span>
        <span style="color: #bdbfc2">STAKED</span>
      </div>
      <div class="btn-row">
        <span class="value"> {{ (loadingUserStakings ? 0 : staked) | amountForm }} </span>
    </div>
    <ConnectMetaMask v-if="!metamaskConnected"/>
    <div class="text-center" v-else>
      <template v-if="poolStatus === 'Active'">
        <button
          class="primary-btn"
          v-if="status === 'Active'"
          disabled
          @click="isCheckedRemark ? showContribute = true : showMoonbeamRegister = true"
        >
          <b-spinner small type="grow" v-show="!isConnected || !moonbeanOk"></b-spinner>
          {{ isCheckedGeofenced ? $t('cl.contribute') : $t('cl.geoDefenced') }}
        </button>
        <button
          class="primary-btn"
          disabled
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
      </template>
      <button class="primary-btn" v-else disabled>
        {{ $t("community." + poolStatus) }}
      </button>
    </div>
    <!-- pool info -->
    <div class="detail-info-box">
      <p style="height:1rem"></p>
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

    <!-- parachain info  -->
    <div class="detail-info-box">
      <!-- <div class="project-info-container">
        <span class="name"> {{ $t('cl.leasePeriod') }} </span>
        <div class="info">{{ leasePeriod || "Loading" }}</div>
      </div> -->
      <div class="project-info-container">
        <span class="name"> {{ $t('cl.countDown') }} </span>
        <div class="info">{{ countDown || "Loading" }}</div>
      </div>
      <div class="project-info-container">
        <span class="name"> {{ $t('cl.fund') }} </span>
        <div class="info">
          <RaisedLabel :fund="getFundInfo" :relaychain='chain' />
        </div>
      </div>
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
          :card='card'
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
      <b-modal
        v-model="showMoonbeamRegister"
        modal-class="custom-modal"
        :scrollable="true"
        size="lg"
        centered
        hide-header
        hide-footer
        no-close-on-backdrop
      >
        <MoonbeamRegister @hideMoonbeam="showMoonbeamRegister=false" :relaychain="chain"/>
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
import { calStatus, MoonbeamParaId, checkGeoFenced, checkRemark } from '@/utils/commen/crowdloan'
import { formatCountdown, handleApiErrCode, sleep } from '@/utils/helper'
import { withdrawReward } from "@/utils/web3/pool";
import MoonbeamRegister from '@/components/Commen/MoonbeamRegister'
import StakingCardHeader from '@/components/Commen/StakingCardHeader'
import ConnectMetaMask from '@/components/Commen/ConnectMetaMask'

export default {
  data () {
    return {
      showContribute: false,
      showWithdraw: false,
      showMoonbeamRegister: false,
      status: 'Completed',
      isWithdrawing: false,
      isCheckedGeofenced: false,
      isCheckedRemark: false,
      moonbeanOk: false
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
    RaisedLabel,
    MoonbeamRegister,
    StakingCardHeader,
    ConnectMetaMask
  },
  methods: {
    async withdraw() {
      try{
        this.isWithdrawing = true
        await withdrawReward(this.card.communityId, this.card.pid)
        this.$bvToast.toast(this.$t('tip.withdrawSuccess'), {
          title: this.$t('tip.success'),
          variant: "success"
        })
      }catch(e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      }finally{
        this.isWithdrawing = false
      }
    },
    openNewTab (id) {
      window.open(`${window.location.origin}/#/specify?id=${id}`, '_blank')
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
    ...mapState(['metamaskConnected', 'lang', 'prices']),
    ...mapState('web3', ['pendingRewards', 'userStakings', 'loadingUserStakings', 'monitorPools']),
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
    staked() {
      const userStakingBn =
        this.userStakings[this.card.communityId + "-" + this.card.pid];
      if (!userStakingBn) return 0;
      const decimal = this.card.chainId === 2 ? 10 : 12;
      return parseFloat(userStakingBn.toString() / 10 ** decimal);
    },
    totalDeposited() {
      if (this.card && this.card.isConstant){
        // constant crowdloan
        return this.card.totalStakedAmount / 1e12
      }
      if (!this.card || !this.monitorPools[this.card.communityId + '-' + this.card.pid + '-totalStakedAmount']) return 0;
      const decimals = this.card.chainId === 2 ? 10 : 12;
      return this.card && this.monitorPools[this.card.communityId + '-' + this.card.pid + '-totalStakedAmount'].toString() / (10 ** decimals);
    },
    tvl() {
      return this.totalDeposited * (this.card.chainId ===2 ? this.prices['DOTUSDT']: this.prices['KSMUSDT'])
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
    },
    poolStatus (){
      const canRemove = this.monitorPools[this.card.communityId + '-' + this.card.pid + '-canRemove']
      const hasRemoved = this.monitorPools[this.card.communityId + '-' + this.card.pid + '-hasRemoved']
      const hasStopped = this.monitorPools[this.card.communityId + '-' + this.card.pid + '-hasStopped']
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
    }
  },
  async mounted () {
    this.status = this.getFundInfo?.status || this.card.statusStr
    // check moonbeam legalese
    if (parseInt(this.card.paraId) === MoonbeamParaId){
      try{
        await checkGeoFenced();
        this.isCheckedGeofenced = true;
      }catch(e) {
        this.moonbeanOk = true;
        return;
      }
      this.isCheckedRemark = await checkRemark();
      while(!this.getFundInfo){
        await sleep(0.5);
      }
      this.moonbeanOk = true;
    }else{
      this.isCheckedRemark = true;
      this.isCheckedGeofenced = true;
      this.moonbeanOk = true;
    }
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
