<template>
  <div class="position-relative">
    <i class="modal-close-icon-right" @click="hide"></i>
    <div class="modal-title font20 font-bold" >
      {{
        $t('operation.contribute')
      }}
    </div>
    <div style="color: red;" class="font20 line-height28 font-bold text-center mt-2">
      You're using {{ type.toUpperCase() }} account: {{ account }} to contribute to {{ fund.text }}({{fund.firstPeriod.toNumber() + '-' + fund.lastPeriod.toNumber()}})
    </div>
    <div class="custom-form my-3">
      <div class="input-group-box mb-4">
        <div class="label text-right font20">
          <span class="text-right">{{ $t('wallet.balance') }}: {{ formBalance | amountForm }}</span>
        </div>
        <div class="c-input-group c-input-group-border c-input-group-bg-dark d-flex">
          <input style="flex: 1"
                 type="number"
                 v-model="stakingValue"
                 placeholder="0"
          />
          <div class="c-append">
            <button class="primary-btn input-btn px-2" style="height: 1.6rem"
                    @click="fillMax">{{ $t("commen.max") }}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex" style="margin: 0 -1rem">
      <button class="dark-btn mx-3" @click="hide" :disabled='loading'>{{
            $t("operation.cancel")
          }}</button>
      <button class="primary-btn mx-3" @click="confirm" :disabled='loading'><b-spinner small type="grow" v-show="loading"></b-spinner
      >{{ $t("operation.confirm") }}</button>
    </div>
    <div v-if="takeFee" class="font14 my-1" style="text-align:center">
          {{ `Operation fee: ${fee} NUT` }}
        </div>
    <!-- <div class="text-center mb-2 mt-4 hover-blue" @click="getSp">{{ $t("stake.getSp") }}</div> -->
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { deposit, withdraw } from '@/utils/web3/pool'
import { handleApiErrCode } from '../../utils/helper';
import { getMyJoinedCommunity } from '@/utils/graphql/user'
import { getAllCommunities } from '@/utils/web3/community'
import { stanfiAddress } from "@/utils/polkadot/account";
import { contribute } from '@/utils/polkadot/crowdloan'

export default {
  data () {
    return {
      stakingValue: '',
      loading: false,
      ctokenDecimal: 18
    }
  },
  computed: {
    ...mapState('pool', ['userStaked']),
    ...mapState('user', ['userGraphInfo']),
    ...mapState('currentCommunity', ['communityId']),
    ...mapState('web3', ['fees']),
    ...mapGetters('web3', ['tokenDecimals']),
    staked(){
      if (!this.userStaked) return 0;
      return this.userStaked[this.card.id] ?? 0
    },
    type() {
      if (parseInt(this.card.chainId) === 0) {
        return 'polkadot'
      }else {
        return 'kusama'
      }
    },
    account() {
      let acc = stanfiAddress(this.$store.state.polkadot.account.address, this.card.chainId)
      acc = acc.substring(0, 8) + '...' + acc.substring(acc.length - 8, acc.length)
      return acc
    },
    formBalance(){
      let balance = 0
      if (this.type === 'polkadot') {
        balance = this.$store.state.polkadot.balance.toString() / 1e10
      }else {
        balance = this.$store.state.kusama.balance.toString() / 1e12
      }
      return parseFloat(balance)
    },
    fee() {
      if (this.fees){
        return this.fees['USER'].toFixed(2)
      }
      return 0
    },
    takeFee() {
      if (this.fees) {
        return this.fees['USER'] > 0
      }
      return false
    }
  },
  props: {
    card: {
      type: Object
    },
    fund: {
      type: Object
    }
  },
  methods: {
    hide() {
      if (this.loading) return;
      this.$emit("hideStakeMask");
    },
    fillMax(){
        this.stakingValue =
        this.formBalance
    },
    checkInputValue() {
      const reg = /^\d+(\.\d+)?$/;
      const res =
        reg.test(this.stakingValue) && parseFloat(this.stakingValue) > 0;
      if (!res) {
        this.$bvToast.toast(this.$t('error.inputError'), {
          title: this.$t("error.error"),
          variant: 'info'
        })
      }
      return res;
    },
    async confirm(){
      if (!this.checkInputValue()) return;
      this.loading = true;
      try{
        await contribute(this.type, this.card.paraId, this.stakingValue, this.card.id, (title, info) => {
          this.$bvToast.toast(title, info)
        }, () => {
          setTimeout(() => {
            if (!this.userGraphInfo.inCommunities || this.userGraphInfo.inCommunities.map(c => c.id).indexOf(this.communityId.toLowerCase()) === -1){
              // first join
              getAllCommunities(true)
              getMyJoinedCommunity()
            }
            this.$emit("hideStakeMask");
          }, 3000);
        })
      }catch(e){
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      }finally{
        this.loading = false
      }
    },
  },
  async mounted () {
    // get user's balance
    this.ctokenDecimal = this.tokenDecimals(this.card.community.cToken)
    // this.stakedDecimal = this.tokenDecimals(this.card.asset)
    // this.balance = await getERC20Balance(this.card.asset)
  },
}
</script>

<style lang="scss" scoped>
@import "src/static/css/modal";
@import "src/static/css/form";
</style>
