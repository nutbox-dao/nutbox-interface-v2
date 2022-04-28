<template>
  <div class="position-relative">
    <i class="modal-close-icon-right" @click="hide"></i>
    <div class="modal-title font20 font-bold" >
      {{
        operate === "add"
          ? $t("stake.stake")
          : $t("stake.unStake")
      }}
    </div>
    <div class="custom-form my-3">
      <div class="input-group-box mb-4">
        <div class="label text-right font20">
          <span class="text-right">{{ $t('wallet.balance') }}: {{ (operate === 'add' ? formBalance : formStaked) | amountForm }}</span>
        </div>
        <div class="c-input-group c-input-group-border c-input-group-bg-dark d-flex">
          <input style="flex: 1"
                 type="number"
                 v-model="stakingValue"
                 :step="1"
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
import { depositErc1155, withdrawErc1155 } from '@/utils/web3/pool'
import { handleApiErrCode } from '../../utils/helper';
import { getMyJoinedCommunity } from '@/utils/graphql/user'
import { getAllCommunities } from '@/utils/web3/community'
import { getBalance } from "@/utils/web3/erc1155";

export default {
  data () {
    return {
      stakingValue: '',
      loading: false,
      balance: 0,
      stakedDecimal: 18,
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
    formBalance(){
      const balance = this.balance;
      return parseFloat(balance.toString() / (10 ** this.stakedDecimal));
    },
    formStaked(){
      const staked = this.staked;
      return parseFloat(staked.toString() / (10 ** this.stakedDecimal))
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
    operate: {
      type: String,
      default: "add",
    },
    card: {
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
        this.operate === "add" ? this.formBalance : this.formStaked;
    },
    checkInputValue() {
      const reg = /^\d+$/;
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
        let message;
        this.stakingValue = parseInt(this.stakingValue)
        if (this.operate === 'add'){
          await depositErc1155(this.card.id, this.stakingValue)
          message = this.$t('transaction.depositOk')
        }else{
          await withdrawErc1155(this.card.id, this.stakingValue)
          message = this.$t('transaction.withdrawOk')
        }
        this.$bvToast.toast(message, {
          title: this.$t('tip.success'),
          variant: 'success'
        })
        setTimeout(() => {
          if (!this.userGraphInfo.inCommunities || this.userGraphInfo.inCommunities.map(c => c.id).indexOf(this.communityId.toLowerCase()) === -1){
            // first join
            getAllCommunities(true)
            getMyJoinedCommunity()
          }
          this.$emit("hideStakeMask");
        }, 3000);
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
    this.stakedDecimal = 0
    this.balance = await getBalance(this.card.asset)
  },
}
</script>

<style lang="scss" scoped>
@import "src/static/css/modal";
@import "src/static/css/form";
</style>
