<template>
  <div class="custom-modal tip-modal">
    <img class="close-btn" src="~@/static/images/close.svg" alt="" @click="hide"/>
    <div class="text-center font20 font-bold" >
      {{
        operate === "add"
          ? $t("stake.stake")
          : $t("stake.unStake")
      }}
    </div>
    <div class="modal-h-line"></div>
    <div class="input-group-box mb-4">
      <div class="label flex-between-start">
        <span>{{
              operate === "add"
                ? $t("stake.stake")
                : $t("stake.unStake")
            }}</span>
        <span class="text-right">{{ $t('wallet.balance') }}: {{ (operate === 'add' ? formBalance : formStaked) | amountForm }}</span>
      </div>
      <div class="input-box flex-between-center">
        <input style="flex: 1"
          type="number"
          v-model="stakingValue"
          placeholder="0"
        />
        <div class="ml-2">
          <button class="primary-btn input-btn" @click="fillMax">{{ $t("commen.max") }}</button>
        </div>
      </div>
    </div>
    <div class="btn-group btn-group-2">
      <button class="primary-btn outline-btn" @click="hide" :disabled='loading'>{{
            $t("commen.cancel")
          }}</button>
      <button class="primary-btn" @click="confirm" :disabled='loading'><b-spinner small type="grow" v-show="loading"></b-spinner
            >{{ $t("commen.confirm") }}</button>
    </div>
    <!-- <div class="text-center mb-2 mt-4 hover-blue" @click="getSp">{{ $t("stake.getSp") }}</div> -->
  </div>

</template>

<script>
import { mapState } from "vuex";
import { deposit, withdraw } from '@/utils/web3/pool'
import { handleApiErrCode } from '../../utils/helper';
import BN from 'bn.js'

export default {
  data () {
    return {
      stakingValue: '',
      loading: false,
    }
  },
  computed: {
    ...mapState('web3', ['userBalances', 'userStakings', 'account']),
    balance(){
      return this.userBalances[this.card.address] ?? 0
    },
    staked(){
      return this.userStakings[this.card.communityId + '-' + this.card.pid] ?? 0
    },
    formBalance(){
      const balance = this.balance;
      const decimal = this.card.decimal;
      return parseFloat(balance.toString() / (10 ** decimal));
    },
    formStaked(){
      const staked = this.staked;
      const decimal = this.card.decimal;
      return parseFloat(staked.toString() / (10 ** decimal))
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
      const decimal = new BN(10).pow(new BN(this.card.decimal))
      const amount = new BN(Number(this.stakingValue * 1e6)).mul(decimal).divn(1e6)
      try{
        let res;
        let message;
        if (this.operate === 'add'){
          res = await deposit(this.card.communityId, this.card.pid, amount)
          message = this.$t('transaction.depositOk')
        }else{
          res = await withdraw(this.card.communityId, this.card.pid, amount)
          message = this.$t('transaction.withdrawOk')
        }
        this.$bvToast.toast(message, {
          title: this.$t('tip.success'),
          variant: 'success'
        })
        setTimeout(() => {
          this.$emit("hideStakeMask");
        }, 2000);
      }catch(e){
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      }finally{
        this.loading = false
      }
    },
  },
  mounted () {
  },
}
</script>

<style lang="scss" scoped>
@import "src/static/css/modal";

</style>
