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
        <span class="text-right">{{ $t('wallet.balance') }}: {{ (operate === 'add' ? formHP : staked) | amountForm }}</span>
      </div>
      <div class="input-box flex-between-center">
        <input style="flex: 1"
          type="number"
          v-model="delegatevalue"
          placeholder="0"
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
      <button class="primary-btn" @click="confirm" :disabled='loading'>
        <b-spinner small type="grow" v-show="loading"></b-spinner
            >{{ $t("commen.confirm") }}</button>
    </div>
    <div class="text-center mb-2 mt-4 hover-blue" @click="getHp">{{ $t("stake.getHp") }}</div>
    <div class="text-center text-grey-light font14">{{ $t("commen.delegatecharge") }}： {{ fee }} HIVE</div>
  </div>

</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import { hexToString } from '@/utils/web3/utils'
import { getDelegateFromHive, hiveDelegation } from '@/utils/hive/hive'
import { HIVE_STAKE_FEE } from '@/config'

export default {

  data () {
    return {
      delegatevalue: '',
      loading: false,
      fee: HIVE_STAKE_FEE
    }
  },
  computed: {
    ...mapState('hive', ['hiveAccount', 'hiveBalance', 'vestsToHive', 'vestsBalance']),
    ...mapState('web3', ['depositDatas', 'account', 'userStakings']),
    ...mapGetters('hive', ['hpBalance']),
    formHP(){
      return this.hpBalance;
    },
    staked(){
      const userStakingBn = this.userStakings[this.card.communityId + '-' + this.card.pid]
      if(!userStakingBn) return 0;
      return this.vestsToHive * (this.userStakings[this.card.communityId + '-' + this.card.pid].toString() / 1e6)
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
    ...mapActions('hive', ['getVests','getHive']),
    ...mapMutations('hive', ['saveHiveBalance', 'saveVestsBalance']),
    hide() {
      if (this.loading) return;
      this.$emit("hideDelegateMask");
    },
    fillMax(){
        this.delegatevalue =
        this.operate === "add" ? this.hpBalance : this.staked;
    },
    checkDelegateFee() {
      if (this.hiveBalance >= 1){
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
      let hp = 0;
      this.loading = true;
      const haveDelegated = await getDelegateFromHive(this.hiveAccount, hexToString(this.card.agentAccount))
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
        hp = parseFloat(haveDelegated) + parseFloat(this.delegatevalue)
      } else {
        hp = parseFloat(haveDelegated) - parseFloat(this.delegatevalue)
        hp = hp < 0 ? 0 : hp
      }
      this.delegateHp(hp);
    },
    async delegateHp(hp) {
      try{
        hp = parseFloat(hp)
        if ((hp !== 0 && !this.checkInputValue()) || !(await this.checkAddress()) || !this.checkDelegateFee()){
          return;
        }
        const amount = parseFloat(hp / this.vestsToHive).toFixed(6);
        const res = await hiveDelegation(
          this.hiveAccount,
          hexToString(this.card.agentAccount),
          amount,
          this.card.communityId,
          this.card.pid,
          this.account
        )
        if (res.success === true){
          this.getVest();
          this.getHive();

        }
      }catch(e){
        console.log(52, e);
      }finally{
        this.loading = false
      }
    },
    getHp() {
      window.open("https://blocktrades.us/en/trade", "_blank");
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
