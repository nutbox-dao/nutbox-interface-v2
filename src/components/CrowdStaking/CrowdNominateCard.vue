<template>
  <div class="multi-card">
    <div class="card-link-top-box">
      <div class="flex-start-center">
        <div class="card-link-icons">
          <img class="icon1" :src="nomination.communityIcon" alt="" />
          <img class="icon2" :src="nomination.icon" alt="" />
        </div>
        <div class="card-link-title-text font20 font-bold">
          <div
            class="link-title"
            @click="
              $router.push(
                '/community/detail-info?id=' + nomination.communityId
              )
            "
          >
            <span>{{ nomination.communityName }}</span>
            <i class="link-icon"></i>
          </div>
          <div class="link-title">
            <span>{{ nomination.poolName }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="c-card">
      <div class="text-left mt-3">
        <span style="color: #717376" class="font-bold">{{
          nomination.tokenSymbol + " "
        }}</span>
        <span style="color: #bdbfc2">EARNED</span>
      </div>
      <div class="btn-row">
        <span class="value"> {{ pendingReward | amountForm }} </span>
        <div class="right-box">
          <button
            class="primary-btn m-0"
            :disabled="isWithdrawing"
            @click="withdraw"
          >
            <b-spinner small type="grow" v-show="isWithdrawing"></b-spinner>
            {{ $t("commen.withdraw") }}
          </button>
        </div>
      </div>

      <div class="detail-info-box">
        <div class="text-left mt-3 mb-1">
          <span style="color: #717376" class="font-bold">{{
            relayer === 'polkadot' ? 'DOT' : 'KSM'
          }}</span>
          <span style="color: #bdbfc2"> STAKED</span>
        </div>
        <div class="btn-row">
          <span class="value">
            {{ (loadingUserStakings ? 0 : nominated) | amountForm }}
          </span>
        </div>
        <div class="text-left mt-3 mb-1">
          <span style="color: #bdbfc2">VALIDATOR ADDRESS  </span>
          <img @click="copyValidator" style="width:1rem;height:1rem;cursor: pointer;" src="~@/static/images/copy.svg" alt="">
        </div>
        <div class="btn-row bt-1 mb-1">
          <span>
            {{ formatValidatorAccount }}
          </span>
        </div>

        <button
          class="primary-btn"
          @click="nominate"
          :disabled="loadingStaking"
        >
          <b-spinner small type="grow" v-show="loadingStaking"></b-spinner
          >{{ $t("cs.nominate") }}
        </button>
        <div class="project-info-container">
          <span class="name"> TVL </span>
          <div class="info">{{ tvl | amountForm(4) }}</div>
        </div>
        <div class="project-info-container">
          <span class="name"> APY </span>
          <div class="info">{{ nomination.apy.toFixed(2) }}%</div>
        </div>
      </div>

      <b-modal
        v-model="showNominate"
        modal-class="custom-modal"
        centered
        hide-header
        hide-footer
        no-close-on-backdrop
      >
        <TipNominator
          :crowdstaking="nomination"
          @hideNominate="showNominate = false"
        />
      </b-modal>

      <b-modal
        v-model="showBondAndNominator"
        modal-class="custom-modal"
        centered
        hide-header
        hide-footer
        no-close-on-backdrop
      >
        <TipBondAndNominator
          :crowdstaking="nomination"
          @hideBondAndNominate="showBondAndNominator = false"
        />
      </b-modal>
    </div>
  </div>
</template>

<script>
import TipBondAndNominator from "@/components/Commen/TipBondAndNominator";
import TipNominator from "@/components/Commen/TipNominator";
import { mapState } from "vuex";
import { getMinNominatorBond } from '@/utils/commen/crowdStaking'
import { handleApiErrCode } from '@/utils/helper'
import { withdrawReward } from '@/utils/web3/pool'

export default {
  name: "CrowdNominateCard",
  data() {
    return {
      showNominate: false,
      showBondAndNominator: false,
      isWithdrawing: false,
      relayer: '',
      minNominatorsBond: 0,
      formatValidatorAccount: ''
    };
  },
  props: {
    nomination: {
      type: Object,
    },
  },
  filters: {
    formatValidatorAdd: function (add) {
      return add.slice(0, 3) + "..." + add.slice(-3);
    },
  },
  components: {
    TipBondAndNominator,
    TipNominator,
  },
  methods: {
    nominate() {
      if (this.minNominatorsBond.toNumber() <= this.locked.toNumber()) {
        this.showNominate = true;
      } else {
        this.showBondAndNominator = true;
      }
    },
    copyValidator() {
      const address = this.nomination.validatorAccount
      navigator.clipboard.writeText(address).then(() => {
        this.$bvToast.toast(
          this.$t('tip.copyAddress', {
            address: this.formatValidatorAccount
          }),
          {
            title: this.$t('tip.clipboard'),
            autoHideDelay: 5000,
            variant: 'info' // info success danger
          }
        )
      }, (e) => {
        console.log(e)
      })
    },
    async withdraw() {
      try{
        this.isWithdrawing = true
        await withdrawReward(this.nomination.communityId, this.nomination.pid)
      }catch(e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      }finally{
        this.isWithdrawing = false  
      }
    },
  },
  computed: {
    ...mapState({
      pLocked: state => state.polkadot.locked,
      kLocked: state => state.kusama.locked,
      pNominators: state => state.polkadot.nominators,
      kNominatore: state => state.kusama.nominators
    }),
    ...mapState("web3", [
      "pendingRewards",
      "approvements",
      "loadingApprovements",
      "userStakings",
      "loadingUserStakings",
      "totalStakings",
      "blockNum",
    ]),
    ...mapState(["lang"]),
    nominated () {
      const userStakingBn =
        this.userStakings[this.nomination.communityId + "-" + this.nomination.pid];
      if (!userStakingBn) return 0;
      const decimal = this.nomination.chainId === 2 ? 10 : 12;
      return parseFloat(userStakingBn.toString() / 10 ** decimal);
    },
    tvl() {
      const tvl =
        this.totalStakings[
          this.nomination.communityId + "-" + this.nomination.pid
        ];
      if (!tvl) return 0;
      const decimal = this.nomination.chainId === 2 ? 10 : 12;
      return tvl.toString() / 10 ** decimal;
    },
    pendingReward() {
      const pendingBn =
        this.pendingRewards[
          this.nomination.communityId + "-" + this.nomination.pid
        ];
      if (!pendingBn) return 0;
      const decimal = this.nomination.tokenDecimal;
      return parseFloat(pendingBn.toString() / 10 ** decimal).toFixed(3);
    },
    loadingStaking () {
      return this.$store.state.polkadot.loadingStaking || this.$store.state.kusama.loadingStaking
    },
    locked() {
      return this.relayer === 'polkadot' ? this.pLocked : this.kLocked
    },
    nominators(){
      return this.relayer === 'polkadot' ? this.pNominators : this.kNominators
    }
  },
  mounted() {
    this.relayer = this.nomination.chainId === 2 ? 'polkadot' : 'kusama'
    this.formatValidatorAccount = this.nomination.validatorAccount.slice(0, 16) + '......' + this.nomination.validatorAccount.slice(-12)
    getMinNominatorBond(this.relayer).then(res => {
      this.minNominatorsBond = res
    })
  },
};
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
