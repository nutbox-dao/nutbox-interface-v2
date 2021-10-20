<template>
  <div>
    <div class="wallet-card">
      <div class="top flex-between-center">
        <img :src="logo" alt="" class="logo" />
        <div class="balance-right flex-full">
          <div class="flex-between-center font-bold font16 mb-1">
            <span>{{ name }}</span>
            <span>{{ balances | amountForm(4) }}</span>
          </div>
          <div class="text-left font12 desc">
            <span>{{ desc }}</span>
          </div>
        </div>
      </div>
      <div class="btn-group btn-group-1">
        <button class="primary-btn" @click="showUnbond=true" :disabled='parseFloat(balances) < 0.0001'>
          {{ $t('wallet.unBond') }}
        </button>
      </div>
    </div>
      <b-modal
      v-model="showUnbond"
      modal-class="custom-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <TipUnbond @hideBond="showUnbond = false" />
    </b-modal>
  </div>
</template>

<script>
import TipUnbond from './TipUnbond'
import { mapState } from 'vuex'

export default {
  name: 'BalanceView',
  data () {
    return {
      showTransfer: false,
      showUnbond: false
    }
  },
  props: {
    name: {
      type: String,
      default: 'DOT'
    },
    balances: {
      type: Number,
      default: 0.00
    },
    logo: {
      type: String,
      default: ''
    },
    transfer: {
      type: Boolean,
      default: true
    },
    walletType: {
      type: String,
      default: 'DOT' // 0:steem  1: tron
    },
    desc: {
      type: String,
      default: 'DOT'
    },
    balanceDigit: {
      type: Number,
      default: 4
    },
    address: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState('polkadot', ['redeemable'])
  },
  components: {
    TipUnbond
  },
  methods: {
    redeem () {

    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/static/css/card/wallet-card";
</style>
