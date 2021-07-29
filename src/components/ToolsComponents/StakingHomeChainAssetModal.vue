<template>
  <div class="tip-modal delegate-modal">
    <img class="close-btn" src="~@/static/images/close.svg" alt="" @click="hide"/>
    <div class="c-modal-header">
      <div class="text-left font20 font-bold" >
        {{
            operate === "add"
              ? $t("farm.stake")
              : $t("farm.unStake")
          }}
      </div>
    </div>
    <div class="modal-h-line"></div>
    <div class="input-group-box mb-4">
      <div class="label flex-between-start">
        <span>{{
              operate === "add"
                ? $t("farm.stake")
                : $t("farm.unStake")
            }}</span>
        <span class="text-right">{{ $t('wallet.balance') }}: {{ (operate === 'add' ? formBalance : formStaked) | amountForm }}</span>
      </div>
      <div class="input-box flex-between-center">
        <input style="flex: 1"
          type="number"
          v-model="stakingValue"
          placeholder="0"
        />
        <div>
          <button class="primary-btn input-btn" @click="fillMax">{{ $t("message.max") }}</button>
        </div>
      </div>
    </div>
    <div class="btn-group btn-group-2">
      <button class="primary-btn outline-btn" @click="hide" :disabled='loading'>{{
            $t("message.cancel")
          }}</button>
      <button class="primary-btn" @click="confirm" :disabled='loading'><b-spinner small type="grow" v-show="loading"></b-spinner
            >{{ $t("message.confirm") }}</button>
    </div>
    <!-- <div class="text-center mb-2 mt-4 hover-blue" @click="getSp">{{ $t("stake.getSp") }}</div> -->
  </div>

</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import { hexToString } from '@/utils/web3/utils'

export default {
  data () {
    return {
      stakingValue: '',
      loading: false,
    }
  },
  computed: {
    ...mapState('steem', ['steemAccount', 'steemBalance', 'vestsToSteem', 'vestsBalance']),
    ...mapState('web3', ['depositDatas', 'account']),
    ...mapGetters('steem', ['spBalance']),
    balance(){
      return this.spBalance;
    },
    staked(){
      
    },
    formBalance(){

    },
    formStaked(){

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
    ...mapActions('steem', ['getVests','getSteem']),
    ...mapMutations('steem', ['saveSteemBalance', 'saveVestsBalance']),
    hide() {
      if (this.loading) return;
      this.$emit("hideStakeMask");
    },
    fillMax(){
        this.stakingValue =
        this.operate === "add" ? this.spBalance : this.depositDatas[this.card.asset];
    },
    async checkAddress() {
      return true
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
        sp = parseFloat(haveDelegated) + parseFloat(this.stakingValue)
      } else {
        sp = parseFloat(haveDelegated) - parseFloat(this.stakingValue)
        sp = sp < 0 ? 0 : sp
      }
      this.delegateSp(sp);
    },
    async delegateSp(sp) {
      try{
        sp = parseFloat(sp)
        if ((sp !== 0 && !this.checkInputValue())){
          return;
        }
        const amount = parseFloat(sp / this.vestsToSteem).toFixed(6);
        const res = await steemDelegation(
          this.steemAccount,
          hexToString(this.card.agentAccount),
          amount,
          this.account
        )
        if (res.success === true){
          this.getVest();
          this.getSteem();
        }
      }catch(e){
        console.log(52, e);
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
