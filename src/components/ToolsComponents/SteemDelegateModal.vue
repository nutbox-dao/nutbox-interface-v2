<template>
  <div class="tip-modal delegate-modal">
    <img class="close-btn" src="~@/static/images/close.svg" alt="" @click="hide"/>
    <div class="c-modal-header">
      <div class="text-left font20 font-bold" >
        {{
            operate === "add"
              ? $t("stake.creaseDelegation")
              : $t("stake.increaseDelegation")
          }}
      </div>
    </div>
    <div class="modal-h-line"></div>
    <div class="input-group-box mb-4">
      <div class="label flex-between-start">
        <span>{{
              operate === "add"
                ? $t("stake.creaseDelegation")
                : $t("stake.increaseDelegation")
            }}</span>
        <span class="text-right">{{ $t('wallet.balance') }}: {{ (operate === 'add' ? formSP : staked) | amountForm }}</span>
      </div>
      <div class="input-box flex-between-center">
        <input style="flex: 1"
          type="number"
          v-model="delegatevalue"
          placeholder="0"
          @keyup="isMax=false"
        />
        <div>
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
    <div class="text-center mb-2 mt-4 hover-blue" @click="getSp">{{ $t("stake.getSp") }}</div>
    <div class="text-center text-grey-light font14">{{ $t("commen.delegatecharge") }}： {{ fee }} STEEM</div>
  </div>

</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import { hexToString } from '@/utils/web3/utils'
import { getDelegateFromSteem, steemDelegation } from '@/utils/steem/steem'
import { STEEM_STAKE_FEE } from '@/config'

export default {

  data () {
    return {
      delegatevalue: '',
      loading: false,
      fee: STEEM_STAKE_FEE,
      isMax: false
    }
  },
  computed: {
    ...mapState('steem', ['steemAccount', 'steemBalance', 'vestsToSteem', 'vestsBalance']),
    ...mapState('web3', ['userStakings', 'account']),
    ...mapGetters('steem', ['spBalance']),
    formSP(){
      return this.spBalance;
    },
    staked(){
      const userStakingBn = this.userStakings[this.card.communityId + '-' + this.card.pid]
      if(!userStakingBn) return 0;
      return this.vestsToSteem * (this.userStakings[this.card.communityId + '-' + this.card.pid].toString() / 1e6)
    },
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
    ...mapActions('steem', ['getVests','getSteem']),
    ...mapMutations('steem', ['saveSteemBalance', 'saveVestsBalance']),
    hide() {
      if (this.loading) return;
      this.$emit("hideDelegateMask");
    },
    fillMax(){
        this.delegatevalue =
        this.operate === "add" ? this.spBalance : this.staked;
        this.isMax = true;
    },
    checkDelegateFee() {
      if (this.steemBalance >= 1){
        return true;
      }
      this.$bvToast.toast(this.$t('error.delegateeroor'), {
        title: this.$t('error.notEnoughFee'),
        variant: 'info'
      })
      return false
    },
    async checkAddress() {
      return true
    },
    checkInputValue() {
      const reg = /^\d+(\.\d+)?$/;
      const res =
        reg.test(this.delegatevalue) && parseFloat(this.delegatevalue) > 0;
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
      let sp = 0;
      this.loading = true;
      const haveDelegated = await getDelegateFromSteem(this.steemAccount, hexToString(this.card.agentAccount))
      if (haveDelegated < 0) {
        this.$bvToast.toast(this.$t('error.delegateerror'), {
          title:this.$t('error.pleaseRetry'),
          variant: 'info'
        })
        this.loading = false
        return false
      }
      console.log('delegated', haveDelegated);
      if (this.operate === 'add') {
        sp = parseFloat(haveDelegated) + parseFloat(this.delegatevalue)
      } else {
        sp = parseFloat(haveDelegated) - parseFloat(this.delegatevalue)
        sp = sp < 0 ? 0 : sp
      }
      this.delegateSp(sp);
    },
    async delegateSp(sp) {
      try{
        sp = parseFloat(sp)
        if ((sp !== 0 && !this.checkInputValue()) || !this.checkDelegateFee()){
          return;
        }
        const amount = parseFloat(sp / this.vestsToSteem).toFixed(6);
        const res = await steemDelegation(
          this.steemAccount,
          hexToString(this.card.agentAccount),
          amount,
          this.card.communityId,
          this.card.pid,
          this.account
        )
        if (res.success === true){
          this.getVests();
          this.getSteem();
          this.$emit("hideDelegateMask");
        }
      }catch(e){
        console.log('Delegate sp fail5', e);
      }finally{
        this.loading = false
      }
    },
    getSp() {
      window.open("https://steemit.com/", "_blank");
    },
  },
  mounted () {
  },
}
</script>

<style lang="scss" scoped>
.input-group-box {
  background: rgba(246, 247, 249, 1);
  border-radius: .8rem;
  .label {
    padding: 1.2rem .8rem .6rem;
    span {
      white-space: nowrap;
    }
  }
  .balance {
    padding: .8rem .8rem 0;
    color: #717376;
    font-size: .7rem;
  }
  .input-box {
    padding: 0 .8rem .8rem 0;
  }
  .input-btn {
    height: 1.6rem;
    padding: 0 .6rem;
    min-height: 1.6rem;
  }
}
.btn-group {
  gap: 1rem;
}
.primary-btn {
  border-radius: 2.4rem;
}

.hover-blue:hover{
  cursor: pointer;
  color: var(--link)
}

</style>
