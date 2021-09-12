<template>
  <div class="multi-card">
    <div class="card-link-top-box">
      <div class="flex-start-center">
        <div class="card-link-icons">
          <img class="icon1" :src="nomination.communityIcon" alt="" />
          <img class="icon2" :src="nomination.icon" alt="" />
        </div>
        <div class="card-link-title-text font20 font-bold">
          <div class="link-title" @click="$router.push('/community/detail-info?id='+nomination.communityId)">
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
      <div class="detail-info-box">
        <template v-if="isConnected">
          <button
            class="primary-btn"
            @click="nominate"
            :disabled="nominated || loadingStaking"
          >
            <b-spinner small type="grow" v-show="loadingStaking"></b-spinner
            >{{ nominated ? $t("cs.nominated") : $t("cs.nominate") }}
          </button>
        </template>
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
import TipBondAndNominator from '@/components/Commen/TipBondAndNominator'
import TipNominator from '@/components/Commen/TipNominator'
import { mapState } from 'vuex'
import { stanfiAddress } from '@/utils/commen/account'
import BN from 'bn.js'

export default {
  name: 'CrowdNominateCard',
  data () {
    return {
      showNominate: false,
      showBondAndNominator: false
    }
  },
  props: {
    nomination: {
      type: Object
    }
  },
  filters: {
    formatValidatorAdd: function (add) {
      return add.slice(0, 3) + '...' + add.slice(-3)
    }
  },
  components: {
    TipBondAndNominator,
    TipNominator
  },
  methods: {
    async nominate () {
      if (this.bonded) {
        this.showNominate = true
      } else {
        this.showBondAndNominator = true
      }
    }
  },
  computed: {
    ...mapState('polkadot', [
      'isConnected',
      'lang',
      'bonded',
      'nominators',
      'loadingStaking',
      'allValidatorInfosInOurDB'
    ]),
    ...mapState("web3", [
      "pendingRewards",
      "approvements",
      "loadingApprovements",
      "userStakings",
      "loadingUserStakings",
      "totalStakings",
      "blockNum"
    ]),
    ...mapState(['lang']),
    // 用户已经投了该项目的节点
    nominated () {

    },
    tvl () {
      const tvl = this.totalStakings[this.nomination.communityId + '-' + this.nomination.pid]
      if(!tvl) return 0;
      const decimal = this.nomination.decimal
      return (tvl.toString() / (10 ** decimal))
    }
  },
  mounted () {
    console.log(this.nomination);
  }
}
</script>

<style lang="scss" scoped>
@import "src/static/css/card/common-card";
</style>
