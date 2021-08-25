<template>
  <div class="c-card">
    <div class="card-title-box flex-start-center">
      <div class="card-single-icon mr-2">
        <img class="icon1" :src="card.tokenIcon" alt="" />
      </div>
      <div class="card-link-title-text">
        <div class="title-text font20 font-bold link-title">
          <span>{{ card.poolName }}</span>
        </div>
      </div>

    </div>
    <div class="h-line mt-4 mb-2"></div>
    <!-- <div class="detail-info-box">
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
        <div class="info">{{ tvl | amountForm(4)}} ({{card.project.validators.length}})</div>
      </div>
      <div class="project-info-container">
        <span class="name"> APY </span>
        <div class="info">13.0%</div>
      </div>
    </div> -->

    <b-modal
      v-model="showNominate"
      modal-class="custom-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <TipNominator
        :crowdstaking="card"
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
        :crowdstaking="card"
        @hideBondAndNominate="showBondAndNominator = false"
      />
    </b-modal>
  </div>
</template>

<script>
import TipBondAndNominator from '@/components/CrowdStaking/TipBoxes/TipBondAndNominator'
import TipNominator from '@/components/CrowdStaking/TipBoxes/TipNominator'
import { mapState } from 'vuex'
import { stanfiAddress } from '@/utils/commen/account'
import BN from 'bn.js'

export default {
  name: 'DNominateCard',
  data () {
    return {
      showNominate: false,
      showBondAndNominator: false
    }
  },
  props: {
    card: {
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
    ...mapState(['lang']),
    ...mapState('web3', ['pendingRewards']),
    pendingReward(){
      const pendingBn = this.pendingRewards[this.card.communityId + '-' + this.card.pid]
      if(!pendingBn) return 0;
      const decimal = this.card.decimal
      return parseFloat(pendingBn.toString() / (10 ** decimal)).toFixed(3)
    },
    symbol(){
      console.log('');
      return this.card
    },
    tvl () {
      
    }
  },
  mounted () {
    console.log('nominate card', this.card);
  }
}
</script>

<style lang="scss" scoped>
@import "src/static/css/card/common-card";
</style>
